// import React, { useEffect, useState } from "react";
// import { io } from "socket.io-client";

// const socket = io("http://localhost:5000");

// function App() {
//   const [resume, setResume] = useState("");
//   const [atsScore, setAtsScore] = useState(null);

//   useEffect(() => {
//     socket.on("scoring resume", (score) => {
//       setAtsScore(score);
//     });

//     return () => {
//       socket.off("scoring resume");
//     };
//   }, []);

//   const handleChange = (e) => {
//     const content = e.target.value;
//     setResume(content);
//     socket.emit("generateResume", { prompt: content });
//   };

//   return (
//     <div style={{ padding: "2rem" }}>
//       <h1>Resume Editor</h1>
//       <textarea
//         value={resume}
//         onChange={handleChange}
//         rows={15}
//         cols={80}
//         placeholder="Type your resume here..."
//       />
//       {atsScore !== null && (
//         <div>
//           <h3>ATS Score: {atsScore}</h3>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Home/Dashboard';
import CreateResumeForm from './pages/Home/CreateResumeForm';
import ResumeEditor from './pages/ResumeUpdate/Editor/ResumeEditor';
import UserProvider from './context/UserContext';

const App = () => {
  return (
    <UserProvider>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create" element={<CreateResumeForm />} />
            <Route path="/edit/:id" element={<ResumeEditor />} />
          </Routes>
        </div>
        <Toaster
          toastOptions={{
            className: '',
            style: {
              fontSize: '13px',
            },
          }}
        />
      </Router>
    </UserProvider>
  );
};

export default App;