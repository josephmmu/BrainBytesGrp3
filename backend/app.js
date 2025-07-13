// backend/app.js
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import aiService from './aiService.js';

const app = express();
const JWT_SECRET = 'ooosecretkeeyy1';

app.use(cors());
app.use(express.json());

// Models
const messageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  text: String,
  isUser: { type: Boolean, default: true },
  subject: String,
  createdAt: { type: Date, default: Date.now }
});

// User Schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  mainSubject: String,
  name: String,
  preferredSubjects: [String]
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





// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the BrainBytes API' });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'No account found. Please register first.' });
    if (user.password !== password) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    return res.status(200).json({ 
      message: 'Login successful', 
      token, 
      user: { id: user._id, email: user.email, mainSubject: user.mainSubject || null }
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already in use' });

    const newUser = new User({ email, password });
    await newUser.save();
    return res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Registration failed', error: err.message });
  }
});

app.get('/api/messages', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const messages = await Message.find({ userId: decoded.id }).sort({ createdAt: 1 });
    res.json(messages);
  } catch {
    res.status(401).json({ message: 'Invalid Token' });
  }
});

app.post('/api/messages', async (req, res) => {
  const authHeader = req.headers.authorization;
  const { text, subject } = req.body;
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });

  const token = authHeader.split(' ')[1];
  let userId;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    userId = decoded.id;
  } catch {
    return res.status(401).json({ message: 'Invalid Token' });
  }

  try {
    const userMessage = new Message({ text, isUser: true, userId, subject });
    await userMessage.save();

    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Request timeout')), 15000));
    const aiResult = await Promise.race([aiService.generateResponse(text, subject), timeout])
      .catch(() => ({ category: 'error', response: "I'm sorry, I couldn't process your request in time." }));

    const aiMessage = new Message({ text: aiResult.response, isUser: false, userId, subject });
    await aiMessage.save();

    res.status(201).json({ userMessage, aiMessage, category: aiResult.category });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/auth/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ message: 'Missing Token' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    return res.status(200).json({ id: decoded.id, email: decoded.email });
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
});

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

app.get('/userprofiles', async (_, res) => {
  const userProfiles = await User.find();
  res.json(userProfiles);
});

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

app.get('/learningmaterials', async (_, res) => {
  const learningMaterials = await LearningMaterial.find();
  res.json(learningMaterials);
});

export default app;
