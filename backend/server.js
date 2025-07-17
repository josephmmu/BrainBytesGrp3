// backend/server.js
import mongoose from 'mongoose';
import app from './app.js';

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.mongodbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: true
}).then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
});
