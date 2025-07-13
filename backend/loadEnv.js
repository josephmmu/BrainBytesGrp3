import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try to load from different possible locations
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config();

console.log('Environment variables loaded:');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'FOUND' : 'NOT FOUND');
console.log('GOOGLE_API_KEY:', process.env.GOOGLE_API_KEY ? 'FOUND' : 'NOT FOUND');
console.log('PORT:', process.env.PORT);