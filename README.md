# 📚 QuizMind - AI-Powered Learning Platform

> A comprehensive web application that helps students revise from their coursebooks using AI-powered quiz generation, interactive chat, and progress tracking.

**Live Demo:** https://beyond-chats-assign.vercel.app/

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
- [How to Run](#how-to-run)
- [Development Journey](#development-journey)
- [What's Implemented](#whats-implemented)
- [What's Missing](#whats-missing)
- [AI/LLM Usage](#aillm-usage)
- [Design Decisions](#design-decisions)

---

## 🎯 Overview

QuizMind is an AI-powered educational platform designed for school students to enhance their learning experience. The application uses Google's Gemini 2.0 Flash model to generate intelligent quizzes from PDF coursebooks and provides an interactive chat interface for students to ask questions and get instant explanations.

**Assignment Submission for:** BeyondChats Full Stack Developer Role  
**Timeline:** 72 hours (October 6-9, 2025)

---

## ✨ Features

### A. Must-Have Features ✅

#### 1. **Source Selector**
- ✅ Dropdown to select from pre-uploaded PDFs (NCERT Class XI Physics)
- ✅ Upload custom PDF coursebooks
- ✅ Support for both options in quiz generation

#### 2. **PDF Viewer**
- ✅ Split-view layout showing PDF preview alongside quiz form
- ✅ Real-time PDF preview when selecting from dropdown or uploading
- ✅ Responsive design for mobile and desktop

#### 3. **Quiz Generator Engine**
- ✅ Generate MCQs (Multiple Choice Questions)
- ✅ Generate SAQs (Short Answer Questions)
- ✅ Generate LAQs (Long Answer Questions)
- ✅ Customizable number of questions per type
- ✅ Real-time quiz taking with instant feedback
- ✅ Scoring with detailed explanations
- ✅ Page-by-page question navigation
- ✅ Option to reattempt quizzes
- ✅ Save quiz attempts to database

#### 4. **Progress Tracking**
- ✅ Comprehensive dashboard showing overall statistics
- ✅ Topic-wise performance breakdown
- ✅ Recent quiz attempts with detailed results
- ✅ Strengths and weaknesses analysis
- ✅ Accuracy rate and average score tracking
- ✅ Click on attempts to view detailed Q&A review

---

### B. Nice-to-Have Features

#### 1. **Chat UI (ChatGPT-inspired)** ✅
- ✅ Full ChatGPT-style interface
- ✅ Left sidebar with chat sessions list
- ✅ Create new chat / Switch between chats
- ✅ Delete chat functionality
- ✅ Mobile responsive with hamburger menu
- ✅ Clean, modern design

#### 2. **PDF-Based Chat with Citations** ✅
- ✅ Upload PDF and ask questions
- ✅ Gemini provides answers based on PDF content
- ✅ Citations with page numbers (when available)
- ✅ Text-only chat also supported
- ✅ PDF attachment stays in state for follow-up questions



## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Material-UI
- **State Management:** React Hooks
- **PDF Processing:** @react-pdf-viewer/core

### Backend
- **Runtime:** Node.js
- **API Routes:** Next.js API Routes
- **Database:** MongoDB (Mongoose ODM)
- **AI Model:** Google Gemini 2.0 Flash Experimental

### DevOps
- **Deployment:** Vercel
- **Version Control:** Git + GitHub

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+
- MongoDB database
- Cloudinary account
- Google Gemini API key

### 1. Clone Repository
git clone https://github.com/Arpit10110/BeyondChats
cd BeyondChats

text

### 2. Install Dependencies
npm install

text

### 3. Environment Variables
Create `.env.local` in root directory:

MongoDB
NEXT_PUBLIC_API_MongodB_Url=mongodb+srv://username:password@cluster.mongodb.net/quizmind

Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here


## 🏃 How to Run

### Development Mode
npm run dev

text
Visit `http://localhost:3000`

### Production Build
npm run build
npm start

text

---

## 🛤️ Development Journey

### Day 1 (Oct 6): Foundation & Quiz System
**Morning:**
- Set up Next.js 14 project with TypeScript
- Created MongoDB schemas (User, SavedQuiz, QuizData)
- Built user registration with WelcomeModal
- Implemented PDF selector (dropdown + upload)

**Afternoon:**
- Integrated Gemini 2.0 Flash for quiz generation
- Built PDF preview component with split-view layout
- Created quiz form with MCQ/SAQ/LAQ options
- Implemented Cloudinary upload for PDFs

**Evening:**
- Built quiz-taking interface with question navigation
- Added instant feedback and explanations
- Implemented scoring system
- Created saved quizzes page with reattempt feature

---

### Day 2 (Oct 7): Progress Tracking & Chat
**Morning:**
- Created QuizAttempt model for detailed tracking
- Built progress dashboard with statistics
- Implemented topic-wise performance breakdown
- Added attempt detail view with Q&A review

**Afternoon:**
- Started chat system with ChatGPT-inspired UI
- Built chat sidebar with session management
- Created message bubbles and input components
- Implemented real-time message display

**Evening:**
- Integrated Gemini File API for PDF-based chat
- Added file upload to chat input
- Implemented "AI is thinking..." loading state
- Fixed mobile responsiveness issues

---

### Day 3 (Oct 8): Polish & Deployment
**Morning:**
- Fixed navbar visibility on mobile chat page
- Implemented logout functionality
- Created beautiful homepage with action cards
- Added proper error handling

**Afternoon:**
- Fixed React hook errors in navbar
- Improved chat UI with better spacing
- Added timestamps to messages
- Implemented auto-scroll for chat

**Evening:**
- Final testing across all features
- Mobile responsiveness fixes
- Documentation and README
- Deployment preparation

---

## ✅ What's Implemented

### Must-Have Features (100%)
- ✅ PDF selector (dropdown + upload)
- ✅ PDF viewer (split-view with preview)
- ✅ Quiz generator (MCQ/SAQ/LAQ)
- ✅ Quiz taking with scoring
- ✅ Explanations and feedback
- ✅ Reattempt quizzes
- ✅ Progress tracking dashboard
- ✅ Strengths/weaknesses analysis
- ✅ Detailed attempt history

### Nice-to-Have Features (66%)
- ✅ ChatGPT-inspired UI
- ✅ Chat with PDF using Gemini
- ✅ Citations in answers (page numbers when available)
- ✅ Mobile responsive chat
- ✅ Session management

### Additional Features (Bonus)
- ✅ User authentication (name-based)
- ✅ Logout functionality
- ✅ Beautiful homepage with cards
- ✅ Loading states and animations
- ✅ Error handling


## 🤖 AI/LLM Usage

### 1. **Development Assistance**
- **Tool Used:** Claude (Anthropic) via Perplexity
- **Purpose:**
  - Architecture planning and design decisions
  - Debugging complex TypeScript errors
  - Next.js 14 App Router best practices
  - MongoDB schema optimization
  - React component structure

### 2. **Code Generation**
- **AI-Assisted:** ~30% of codebase
- **Human-Written:** Core logic, API integration, state management (70%)
- **AI-Generated:** Boilerplate, UI components, styling suggestions

### 3. **Google Gemini 2.0 Flash**
- **Usage:**
  - Quiz generation from PDFs
  - Chat responses with PDF context
  - Answer evaluation and explanations
- **Why Gemini:** 
  - Native file handling
  - Fast response times
  - Free tier availability
  - 2M token context window

### 4. **Debugging Assistance**
- React hook rules violations
- MongoDB connection pooling issues
- Gemini file upload timeouts
- Tailwind CSS responsive design issues

---

## 🎨 Design Decisions

### 1. **Why Next.js 15 App Router?**
- Server-side rendering for better SEO
- Built-in API routes for backend logic
- File-based routing simplicity
- Excellent TypeScript support

### 2. **Why MongoDB?**
- Flexible schema for quiz data
- Easy nested document support
- Good performance for use case
- Free tier on Atlas

### 3. **Why Gemini over OpenAI?**
- Native PDF file handling (no chunking needed)
- Faster response times
- Lower cost (generous free tier)
- 2M token context window

### 4. **Why No Vector Database?**
- Gemini's native file API is sufficient
- Faster implementation
- Less infrastructure complexity
- Good enough citation accuracy for assignment scope

### 5. **UI Framework Choice**
- **Material-UI:** Forms, modals, navigation (rapid development)
- **Tailwind CSS:** Homepage, cards (custom styling)
- **Trade-off:** Mixed approach for speed vs. consistency

### 6. **State Management**
- **React Hooks only:** No Redux/Zustand needed for this scale
- **localStorage:** Simple persistence for user data
- **Trade-off:** Simple but not suitable for multi-device sync

---

## 📁 Project Structure

quizmind/
├── app/
│ ├── page.tsx # Homepage
│ ├── quizzes/page.tsx # Quiz generation
│ ├── savedquiz/page.tsx # Saved quizzes
│ ├── quiz/[id]/page.tsx # Quiz taking
│ ├── progress/page.tsx # Dashboard
│ ├── attempt/[id]/page.tsx # Attempt review
│ ├── chat/
│ │ ├── page.tsx # Chat list
│ │ └── [sessionId]/page.tsx # Chat session
│ └── api/
│ ├── users/register/route.ts
│ ├── quizzes/
│ ├── progress/route.ts
│ └── chat/
├── components/
│ ├── Navbar.tsx
│ ├── WelcomeModal.tsx
│ ├── QuizForm.tsx
│ ├── PDFPreview.tsx
│ └── chat/
│ ├── ChatLayout.tsx
│ ├── ChatSidebar.tsx
│ ├── ChatWindow.tsx
│ ├── MessageBubble.tsx
│ ├── ChatInput.tsx
│ └── EmptyState.tsx
├── models/
│ ├── User.ts
│ ├── SavedQuiz.ts
│ ├── QuizData.ts
│ ├── QuizAttempt.ts
│ ├── ChatSession.ts
│ └── ChatMessage.ts
└── db/
└── db.ts

text

---

## 🧪 Testing

### Manual Testing Checklist
- ✅ User registration and logout
- ✅ PDF upload and selection
- ✅ Quiz generation (all types)
- ✅ Quiz taking and scoring
- ✅ Reattempt functionality
- ✅ Progress tracking accuracy
- ✅ Chat with and without PDF
- ✅ Mobile responsiveness
- ✅ Error handling

### Browser Compatibility
- ✅ Chrome
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

---

## 📊 Performance

- **Initial Load:** ~2-3 seconds
- **Quiz Generation:** ~10-15 seconds (depends on PDF size)
- **Chat Response:** ~2-5 seconds
- **PDF Upload:** ~3-5 seconds

---

## 🐛 Known Issues

1. **Large PDF Timeout:** PDFs >50MB may timeout during processing
2. **Chat Context:** PDF needs to be re-attached after page refresh
3. **Mobile Hamburger:** Slight delay on first click

---

## 📚 Key Learnings

1. Next.js 15 App Router architecture
2. Gemini File API integration
3. MongoDB schema design for complex data
4. Responsive design with mobile-first approach
5. Time management and feature prioritization

---


---

## 🙏 Acknowledgments

- **BeyondChats** for the assignment opportunity
- **Google Gemini** for the AI API
- **Vercel** for hosting
- **MongoDB Atlas** for database

---

## 📞 Contact

**Developer:** Arpit
**GitHub:** https://github.com/Arpit10110/BeyondChats
**Live** https://beyond-chats-assign.vercel.app/
---

## 📄 License

This project was created as part of the BeyondChats Full Stack Developer assignment. All code remains the property of the developer as per assignment terms.

---

**Made with ❤️ and lots of ☕**