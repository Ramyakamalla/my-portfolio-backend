import express, { json, urlencoded } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from "dotenv";

dotenv.config();  // Load environment variables

const app = express();
const PORT = process.env.PORT || 4000; // ✅ Use Render-assigned port

// Middleware
app.use(json());
app.use(urlencoded({ extended: true }));

// ✅ Configure CORS to allow requests only from your Vercel frontend
const allowedOrigins = [process.env.FRONTEND_URL || "https://my-portfolio-ij6t-two.vercel.app"];
app.use(cors({
  origin: allowedOrigins,
  methods: "GET, POST",
  credentials: true
}));

// ✅ Check if MONGO_URI is provided
if (!process.env.MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI is not set!");
  process.exit(1); // Stop server if DB URL is missing
}

// ✅ MongoDB connection with error handling
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });

// Define schema and model
const messageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// ✅ Simple route to check API status
app.get('/', (req, res) => {
  res.send("🚀 Portfolio Backend is Running!");
});

// ✅ Contact form submission route
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const newMessage = new Message({ name, email, message });
    await newMessage.save();
    
    res.status(201).json({ success: "Message received successfully!" });
  } catch (error) {
    console.error("❌ Error saving message:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
