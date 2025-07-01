const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const aiService = require('./aiService');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

const JWT_SECRET = 'ooosecretkeeyy1';

app.use(cors());
app.use(express.json());

process.on('uncaughtException', err => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', err => {
  console.error('Unhandled Rejection:', err);
});

// Initialize AI model
aiService.initializeAI();

// Connect to MongoDB
//mongoose.connect('mongodb://mongo:27017/brainbytes', {
mongoose.connect(process.env.mongodbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB:', err);
});

// Define schemas
const messageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  text: String,
  isUser: { type: Boolean, default: true },
  subject: String,
  createdAt: { type: Date, default: Date.now }
});

// User Schema
const userSchema = new mongoose.Schema({
  email:String,
  password:String,
  mainSubject:String 
});

// Learning Material Schema
const learningMaterialSchema = new mongoose.Schema({
  subject:String, 
  topic:String, 
  content:String
});

const User = mongoose.model('User', userSchema);
const LearningMaterial = mongoose.model('LearningMaterial', learningMaterialSchema);
const Message = mongoose.model('Message', messageSchema);

// API Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the BrainBytes API' });
});

// Login Route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'No account found. Please register first.' });
    }

    // In a real app, compare hashed passwords
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generating token with user info
    const token = jwt.sign(
      { id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d'}
    );

    // Return with jwt token
    return res.status(200).json({ 
      message: 'Login successful', 
      token, 
      user: {
        id: user._id,
        email: user.email,
        mainSubject: user.mainSubject || null
      }});
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

//register
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const newUser = new User({ email, password });
    await newUser.save();

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Registration failed', error: err.message });
  }
});

// Get all messages
app.get('/api/messages', async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized '});
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token,  JWT_SECRET);
    const messages = await Message.find({ userId: decoded.id}).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(401).json({ message: 'Invalid Token' });
  }
});

// Create a new message and get AI response
app.post('/api/messages', async (req, res) => {
  const authHeader = req.headers.authorization;
  const { text, subject } = req.body

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized '});
  }

  const token = authHeader.split(' ')[1];
  let userId;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    userId = decoded.id;
  } catch (err) {
    return res.status(401).json({ message: 'Invalid Token' });
  }

  try {
    // Save user message
    const userMessage = new Message({
      text,
      isUser: true,
      userId,
      subject
    });
    await userMessage.save();
    
    // Generate AI response with a 15-second overall timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), 15000)
    );
    
    // Race between the AI response and the timeout
    const aiResult = await Promise.race([
      aiService.generateResponse(text, subject),
       timeoutPromise])
      .catch(error => ({
          category: 'error',
          response: "I'm sorry, but I couldn't process your request in time. Please try again with a simpler question."
        }));
    
    // Save AI response
    const aiMessage = new Message({
      text: aiResult.response,
      isUser: false,
      userId,
      subject
    });
    await aiMessage.save();
    
    // Return both messages
    res.status(201).json({
      userMessage,
      aiMessage,
      category: aiResult.category
    });
  } catch (err) {
    console.error('Error in /api/messages route:', err);
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/auth/me', async (req, res) => {
  const authHeader = req.headers.authorization;
 
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing Token'});
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    return res.status(200).json({ id: decoded.id, email: decoded.email });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }

});

// Create a new user profile
app.post('/userprofiles', async (req, res) => {
  try {
    const { name, preferredSubjects } = req.body;
    const userProfile = new User({ name, preferredSubjects });
    await userProfile.save();
    res.status(201).json(userProfile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all user profiles
app.get('/userprofiles', async (req, res) => {
  const userProfiles = await User.find();
  res.json(userProfiles);
});

// Create a learning material
app.post('/learningmaterials', async (req, res) => {
  try {
    const { subject, topic, content } = req.body;
    const learningMaterial = new LearningMaterial({ subject, topic, content });
    await learningMaterial.save();
    res.status(201).json(learningMaterial);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all learning materials
app.get('/learningmaterials', async (req, res) => {
  const learningMaterials = await LearningMaterial.find();
  res.json(learningMaterials);
});



// Start the server
try {
  console.log('✅ Setup complete, starting server...');
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
} catch (err) {
  console.error('❌ Error starting server:', err);
}