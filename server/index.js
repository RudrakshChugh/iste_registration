// server/index.js (Your existing code with the crucial addition)
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from './models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This loads environment variables from your local .env file.
// On Vercel, you will set these variables directly in the Vercel dashboard.
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
// Configure CORS to allow requests from your frontend
// process.env.CLIENT_URL must be set in Vercel environment variables for production
app.use(cors({
  origin: process.env.CLIENT_URL
}));
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

console.log("MONGO_URI from .env:", process.env.MONGO_URI); // This will show up in Vercel logs if set

async function connectDB() {
  try {
    console.log("🔄 Attempting to connect to MongoDB...");
    // Use the MONGO_URI from Vercel's environment variables in production
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

connectDB(); // Call the function to connect to the database

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

// The app.listen part is primarily for local development.
// Vercel's serverless functions don't "listen" on a port in the traditional sense;
// they are invoked per request. You can keep it for local testing,
// but it won't be active on Vercel after the module.exports.
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// *******************************************************************
// CRUCIAL ADDITION FOR VERCEL SERVERLESS FUNCTIONS
// *******************************************************************
export default app; // For ES Modules
// If you were using CommonJS (require/module.exports), it would be:
// module.exports = app;