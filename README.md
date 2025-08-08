# Arvyax Wellness Platform

A full-stack wellness platform that empowers users to create, manage, and explore mindfulness sessions with a seamless and responsive experience.

[Live Demo](https://arvyax-asssign.vercel.app) | [API Base URL](https://arvyax-backend-jqxh.onrender.com) | [API Reference](#api-reference)

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Quick Start Guide](#quick-start-guide)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [UI Components](#ui-components)
- [Security Features](#security-features)
- [Responsive Design](#responsive-design)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Contact](#contact)

---

## Overview

**Arvyax Wellness** is designed to streamline the user experience in mindfulness content creation and sharing. With a clean UI, autosave editing tools, and JWT-secured sessions, the platform promotes self-awareness through thoughtful technology.

### Live Apps

- Frontend: [https://arvyax-asssign.vercel.app](https://arvyax-asssign.vercel.app)
- Backend API: [https://arvyax-backend-jqxh.onrender.com](https://arvyax-backend-jqxh.onrender.com)

---

## Key Features

### Authentication

- JWT-based login & signup
- Password strength validation
- Role-based access control
- Protected routes

### Dashboard

- Dual-view: personal and community sessions
- Tag-based filtering and search
- Real-time status indicators

### Session Editor

- Draft & publish modes
- Autosave with visual cues
- Tag suggestion system

### UI Design

- Glassmorphism layout
- Accessible typography
- Responsive, mobile-first layout

---

## Technology Stack

| Layer     | Tools Used |
|-----------|------------|
| Frontend  | React, Axios, Vercel |
| Backend   | Node.js, Express.js, MongoDB, Render |
| Database  | MongoDB Atlas |
| Auth      | JWT |
| Styling   | CSS Modules / Custom Glassmorphism Design |

---

## Quick Start Guide

### Prerequisites

- Node.js >= 14
- MongoDB Atlas account
- Git

### Clone Repository

```bash
git clone https://github.com/your-username/arvyax-wellness.git
cd arvyax-wellness
```

### Backend Setup

```bash
cd backend
npm install
touch .env
```

`.env` file:
```env
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-secret
PORT=5000
FRONTEND_URL=https://arvyax-asssign.vercel.app
```

Start server:
```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## Project Structure

```
arvyax-wellness/
├── frontend/
│   └── src/
│       ├── components/
│       ├── hooks/
│       └── services/
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   └── middleware/
```

---

## Configuration

### Backend `.env`

```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-jwt-secret
PORT=5000
FRONTEND_URL=https://arvyax-asssign.vercel.app
```

### Frontend API Setup (`api.js`)

```js
const API = axios.create({
  baseURL: process.env.NODE_ENV === "production"
    ? "https://arvyax-backend-jqxh.onrender.com/api"
    : "http://localhost:5000/api"
});
```

---

## API Reference

### Auth

| Method | Endpoint            | Description       |
|--------|---------------------|-------------------|
| POST   | /api/auth/register  | Register a user   |
| POST   | /api/auth/login     | Login a user      |

### Sessions

| Method | Endpoint                   | Description               | Auth |
|--------|----------------------------|---------------------------|------|
| GET    | /api/sessions              | Get user sessions         | Yes  |
| GET    | /api/sessions/published/all| Get public sessions       | No   |
| POST   | /api/sessions              | Create session            | Yes  |
| PUT    | /api/sessions/:id          | Update session            | Yes  |
| DELETE | /api/sessions/:id          | Delete session            | Yes  |

---

## UI Components

| Component        | Description                      |
|------------------|----------------------------------|
| Login / Register | User authentication interface    |
| Dashboard        | Session listings and filtering   |
| Session Editor   | Draft, tags, autosave system     |
| Navbar           | Navigation and profile settings  |

---

## Security Features

| Feature               | Status     |
|------------------------|------------|
| JWT Authentication     | Implemented |
| Password Hashing (bcrypt) | Implemented |
| Input Validation       | Implemented |
| CORS Configuration     | Enabled     |
| Protected Routes       | Middleware  |
| Secure Environment Vars| Used        |

---

## Responsive Design

| Device   | Layout Strategy         |
|----------|-------------------------|
| Mobile   | Stacked layout, optimized for touch |
| Tablet   | Adaptive layout with collapsible menus |
| Desktop  | Grid layout with multi-panel interface |

---

## Deployment

### Frontend on Vercel

1. Connect your GitHub repository to Vercel
2. Set:
   - Root: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`

### Backend on Render

1. Connect GitHub repo to Render
2. Root Directory: `backend`
3. Environment:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment Variables from `.env`

### MongoDB Atlas

1. Create a free cluster
2. Add IP whitelist (`0.0.0.0/0`)
3. Create DB user and get connection URI
4. Add URI to `.env` as `MONGODB_URI`

---

## Contributing

### Workflow

```bash
# Fork and clone
git clone https://github.com/your-username/arvyax-wellness.git

# Create new branch
git checkout -b feature/your-feature

# Commit and push
git commit -m "Add new feature"
git push origin feature/your-feature
```

### Guidelines

- Follow ESLint + Prettier styles
- Use meaningful commit messages
- Keep PRs small and focused
- Update README when necessary

---

## Contact

**Sai Charan Nukala**  
Full Stack Developer  
📧 charan.nukala12@gmail.com  
📞 +91 93980 53391  
🌐 [Portfolio](http://saicharannukalaportfolio.vercel.app)  
🔗 [LinkedIn](https://www.linkedin.com/in/sai-charan-nukala)  
🐙 [GitHub](https://github.com/Saicharan-nukala)
