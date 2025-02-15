import express, { json, urlencoded } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from "dotenv";

dotenv.config();  // Load environment variables

const app = express();
const PORT = 4000;

// Middleware
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());

const mongoURI = process.env.MONGO_URI; // Use environment variable

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err.message));

// Define schema and model
const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  date: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// Routes
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  const newMessage = new Message({ name, email, message });
  try {
    await newMessage.save();
    res.status(201).send('Message received');
  } catch (error) {
    res.status(500).send('Error saving message');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
