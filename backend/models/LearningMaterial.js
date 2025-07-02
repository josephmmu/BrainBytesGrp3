import { Schema, model } from 'mongoose';

const learningMaterialSchema = new Schema({
  subject: {
    type: String,
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
});

export default model('LearningMaterial', learningMaterialSchema);