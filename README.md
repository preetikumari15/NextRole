# AI Resume Analyzer

An AI-powered resume analysis platform built using the MERN stack and Google Gemini API.

## Features

- User authentication with JWT
- Resume PDF upload
- Job description analysis
- AI-powered resume evaluation
- ATS score
- Job match score
- Keyword matching
- Skills analysis
- Missing skills detection
- Resume strengths and weaknesses
- ATS compatibility checks
- Section quality analysis
- Experience and project relevance
- AI-generated bullet improvements
- Personalized recommendations
- Analysis history
- Protected routes
- Rate-limited AI analysis
- Secure PDF upload validation

## Tech Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- React Router
- Axios

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Multer

### AI

- Google Gemini API

## 🏗️ Architecture

```text
                    User
                     │
                     ▼
              React + Vite
                 Vercel
                     │
                     │ HTTPS
                     ▼
             Node + Express
                 Render
                     │
          ┌──────────┴──────────┐
          │                     │
          ▼                     ▼
     MongoDB Atlas          Gemini API
          │                     │
          └──────────┬──────────┘
                     ▼
                AI Analysis
