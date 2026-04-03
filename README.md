# 🎓 REMUS - AI-Powered Resume Builder

A full-stack web application for creating professional resumes with LaTeX compilation, AI-powered ATS scoring, and intelligent suggestions.

## 🌐 Live Demo

**[🚀 Try REMUS Live](https://remus.onrender.com)**

![Tech Stack](https://img.shields.io/badge/Stack-MERN-green)
![LaTeX](https://img.shields.io/badge/LaTeX-Compilation-blue)
![AI](https://img.shields.io/badge/AI-OpenAI-orange)
![Deployment](https://img.shields.io/badge/Deployed-Render-46E3B7)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED)

## ✨ Features

- 🎨 **Overleaf-Style Editor** - Dual-pane LaTeX editor with live PDF preview
- 🤖 **AI-Powered Features**
  - ATS (Applicant Tracking System) score analysis
  - Intelligent resume improvement suggestions via OpenAI
- 📄 **LaTeX Compilation** - Professional PDF generation using pdflatex
- 🔐 **Authentication** - Secure login with JWT and Google OAuth
- 💾 **Project Management** - Save, edit, and delete multiple resume projects
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🎯 **Real-time Preview** - See changes instantly as you edit

## 🛠️ Tech Stack

### Frontend
- React + Vite
- Tailwind CSS + ShadCN UI
- Monaco Editor
- React Router
- Axios

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT + Passport.js (Google OAuth)
- OpenAI API
- LaTeX (pdflatex)

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB
- MiKTeX or TeX Live
- OpenAI API key
- Google OAuth credentials (optional)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/remus.git
cd remus
```

2. **Install dependencies**
```bash
# Backend
cd resume-backend
npm install

# Frontend
cd ../resume-frontend
npm install
```

3. **Configure environment variables**

Create `.env` in `resume-backend/`:
```env
PORT=8000
MONGODB_URI=mongodb://localhost:27017/resume-builder
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLIENT_URL=http://localhost:5173
```

4. **Run the application**
```bash
# Start MongoDB
mongod

# Backend (terminal 1)
cd resume-backend
npm start

# Frontend (terminal 2)
cd resume-frontend
npm run dev
```

5. **Access**: http://localhost:5173

## 📁 Project Structure

```
remus/
├── resume-backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   └── server.js
└── resume-frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── context/
    │   └── App.jsx
    └── public/
```

## 🐳 Docker Deployment

The application is fully containerized and deployed on Render.

### Local Testing with Docker

```bash
# Create .env file from template
cp .env.example .env
# Edit .env with your values

# Build and run
docker-compose up --build

# Access:
# Frontend: http://localhost
# Backend: http://localhost:8000
```

### Production Deployment

Deployed on Render with:
- Backend: Docker container with full LaTeX environment
- Frontend: Nginx-served React build
- Database: MongoDB Atlas

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.
