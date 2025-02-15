import express, { json, urlencoded } from 'express';
import mongoose from 'mongoose';
import dotenv from "dotenv";

dotenv.config();  // Load environment variables

const app = express();
const PORT = process.env.PORT || 8080; // Use 8080 as fallback


// Middleware
app.use(json());
app.use(urlencoded({ extended: true }));

// ✅ Configure CORS to allow requests only from your Vercel frontend

//Configure CORS
import cors from "cors";

const allowedOrigins = ["https://my-portfolio-ij6t-two.vercel.app"];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);

// ✅ Debug incoming requests (Check if requests reach the backend)
app.use((req, res, next) => {
  console.log(`📡 Received ${req.method} request from ${req.headers.origin}`);
  next();
});



// ✅ Check if MONGO_URI is provided
if (!process.env.MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI is not set!");
  process.exit(1); // Stop server if DB URL is missing
}
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 10000, // Wait 10 seconds before failing
})
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1); // Exit on failure
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
