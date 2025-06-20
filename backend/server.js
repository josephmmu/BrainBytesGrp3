const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const aiService = require('./aiService');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize AI model
aiService.initializeAI();

// Connect to MongoDB
mongoose.connect('mongodb://mongo:27017/brainbytes', {
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
  text: String,
  isUser: { type: Boolean, default: true },
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



app.get('api/')

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

    // Return a placeholder token (replace with real JWT if needed)
    return res.status(200).json({ message: 'Login successful', token: 'sample-token' });
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
  try {
    const messages = await Message.find().sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new message and get AI response
app.post('/api/messages', async (req, res) => {
  try {
    // Save user message
    const userMessage = new Message({
      text: req.body.text,
      isUser: true
    });
    await userMessage.save();
    
    // Generate AI response with a 15-second overall timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), 15000)
    );
    
    const aiResultPromise = aiService.generateResponse(req.body.text);
    
    // Race between the AI response and the timeout
    const aiResult = await Promise.race([aiResultPromise, timeoutPromise])
      .catch(error => {
        console.error('AI response timed out or failed:', error);
        return {
          category: 'error',
          response: "I'm sorry, but I couldn't process your request in time. Please try again with a simpler question."
        };
      });
    
    // Save AI response
    const aiMessage = new Message({
      text: aiResult.response,
      isUser: false
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
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
