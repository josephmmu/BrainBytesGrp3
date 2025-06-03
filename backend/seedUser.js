const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB (same as your main app)
mongoose.connect('mongodb://mongo:27017/brainbytes');

const User = require('./models/User');

const createUser = async (email, plainPassword) => {
  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  
  await User.create({
    email,
    password: hashedPassword,
    createdAt: new Date()
  });

  console.log(`User ${email} created successfully!`);
};

// Run seed
createUser('admin@brain.com', 'securepass')
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Seed failed:', err);
    process.exit(1);
  });