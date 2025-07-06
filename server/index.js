import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from './models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(express.json());

console.log("MONGO_URI from .env:", process.env.MONGO_URI);

async function connectDB() {
  try {
    console.log("🔄 Attempting to connect to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1); 
  }
}


connectDB();


app.get('/', (req, res) => {
  res.send(' Backend is running');
});


app.post('/register', async (req, res) => {
  const { name, rollNo, email } = req.body;

  try {
    if (!name || !rollNo || !email) {
      return res.json({ success: false, message: "Please fill all the fields." });
    }

    const user = new User({ name, rollNo, email });
    await user.save();

    return res.json({ success: true, message: "Registered successfully" });
  } catch (err) {
    console.error('❌ Registration Error:', err.message);
    return res.json({ success: false, message: "Registration failed. Try again later." });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
