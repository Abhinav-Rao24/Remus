
require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const { OpenAI } = require('openai');
const fs = require('fs');
const path = require('path');
const connectDB = require('./config/db');

// Initialize express app and server
const app = express();
const server = http.createServer(app);
require('./config/passport'); // Initialize Passport Config

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, path) => {
    res.set('Access-Control-Allow-Origin', process.env.CLIENT_URL || 'http://localhost:5173');
  },
}));

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Import routes
const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const editorRoutes = require('./routes/editorRoutes');
const aiRoutes = require('./routes/aiRoutes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api', editorRoutes);
app.use('/api/ai', aiRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  res.send("Resume Backend is running");
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("generateResume", async (data) => {
    try {
      const resumeContent = data.prompt || "";
      const texContent = `% Auto-generated LaTeX resume\n\\documentclass{article}\n\\begin{document}\n${resumeContent}\n\\end{document}`;

      // Save to .tex file in uploads directory
      const tempFile = path.join(__dirname, 'uploads', `resume_${Date.now()}.tex`);
      await fs.promises.writeFile(tempFile, texContent);

      // Get ATS score from OpenAI
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You're an expert resume screener. Score this resume from 0-100 based on suitability for a software developer job and provide brief feedback."
          },
          {
            role: "user",
            content: resumeContent,
          },
        ],
      });

      const analysis = response.choices[0].message.content;
      const scoreMatch = analysis.match(/\d+/);
      const score = scoreMatch ? parseInt(scoreMatch[0]) : 0;

      socket.emit("resume_analysis", {
        score,
        feedback: analysis,
        texFile: tempFile
      });
    } catch (error) {
      console.error("Error generating resume:", error);
      socket.emit("error", "Failed to generate resume");
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Exports for testing
module.exports = {
  server,
  io,
  openai,
  app
};





