import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();  // Load environment variables

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'https://my-portfolio-ij6t-kpd03wd0r-ramya-kamallas-projects.vercel.app',
  methods: 'GET,POST',
  allowedHeaders: 'Content-Type'
}));

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect('mongodb://127.0.0.1:27017/ramyas_portfolio')
  .then(() => console.log("✅ Connected to MongoDB Compass"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err.message));


// Contact form API
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newMessage = new Message({ name, email, message });
    await newMessage.save();
    res.status(201).json({ success: true, message: "Message received!" });
  } catch (error) {
    res.status(500).json({ error: "Error saving message" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
