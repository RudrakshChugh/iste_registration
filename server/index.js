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
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1); 
  }
}

connectDB();

app.get('/', (req, res) => {
  res.send('Backend is running');
});

app.post('/register', async (req, res) => {
  const { name, admissionNo, branch, phone, email } = req.body;

  if (!name || !admissionNo || !branch || !phone || !email) {
    return res.json({ success: false, message: "Please fill all the fields." });
  }

  if (!/^\d{6}$/.test(admissionNo)) {
    return res.json({ success: false, message: "Admission number must be exactly 6 digits." });
  }

  if (!/^\d{10}$/.test(phone)) {
    return res.json({ success: false, message: "Phone number must be exactly 10 digits." });
  }

  if (!email.includes('@')) {
    return res.json({ success: false, message: "Email must contain '@'" });
  }

  const existing = await User.findOne({ $or: [{ email }, { admissionNo }] });
  if (existing) {
    return res.json({ success: false, message: "You have already registered." });
  }

  try {
    const user = new User({ name, admissionNo, branch, phone, email });
    await user.save();
    return res.json({ success: true, message: "Registered successfully!" });
  } catch (err) {
    console.error('❌ Registration Error:', err.message);
    return res.json({ success: false, message: "Registration failed. Try again later." });
  }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
