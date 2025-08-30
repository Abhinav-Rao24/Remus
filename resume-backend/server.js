
// require('dotenv').config();
// const express = require('express');
// const http = require('http');
// const cors = require('cors');
// const { Server } = require('socket.io');
// const { OpenAI } = require('openai');
// const fs = require('fs');

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST"],
//   },
// });

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST"],
//     credentials: true,
//   })
// );
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// app.get("/", (req, res) => {
//   res.send("Resume Backend is running");
// });

// io.on("connection", (socket) => {
//   console.log("A user connected");

//   socket.on("generateResume", async (data) => {
//     try {
//       // Parse resume content from data
//       const resumeContent = data.prompt || "";

//       // Convert to LaTeX (simple template, you can enhance this)
//       const texContent = `% Auto-generated LaTeX resume\n\\documentclass{article}\n\\begin{document}\n${resumeContent}\n\\end{document}`;

//       // Save to .tex file
//       fs.writeFileSync("resume.tex", texContent);

//       // Get ATS score from OpenAI
//       const response = await openai.chat.completions.create({
//         model: "gpt-3.5-turbo",
//         messages: [
//           {
//             role: "system",
//             content: "You're an expert resume screener. Score this resume from 0-100 based on suitability for a software developer job. Respond with just a number."
//           },
//           {
//             role: "user",
//             content: resumeContent,
//           },
//         ],
//       });

//       // Parse score as integer (fallback to 0 if not a number)
//       const scoreStr = response.choices[0].message.content.trim();
//       const score = Number(scoreStr.match(/\d+/)?.[0]) || 0;

//       socket.emit("scoring resume", score);
//     } catch (error) {
//       console.error("Error generating resume:", error);
//       socket.emit("error", "Failed to generate resume");
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("A user disconnected");
//   });
// });

// if (require.main === module) {
//   server.listen(5000, () => {
//     console.log("Server is running on port 5000");
//   });
// }

// module.exports = server;
// module.exports.io = io;
// module.exports.openai = openai;
// module.exports.app = app;


require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
// const { connect } = require('http2');
const connectDB = require('./config/db');


const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');



const app = express();

//middleware to handle cors
app.use(
  cors({
    origin: process.env.clientUrl,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

//connect database
connectDB();


//middleware
app.use(express.json());

//routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);

//server upload folder
app.use('/uploads',
  express.static(path.join(__dirname, 'uploads'),{
    setHeaders: (res,path) =>{
      res.set('Accesss-Control-Allow-Origin', 'http://localhost:5173');
    },

  })
);



//start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});




