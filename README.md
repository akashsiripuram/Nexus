# Nexus - Team Collaboration Platform

A modern team collaboration platform built with React, Node.js, and MongoDB.

## 🌐 Live Demo

- **Frontend**: [https://nexus-v1-phi.vercel.app/](https://nexus-v1-phi.vercel.app/)
- **Backend API**: [https://nexus-eight-lovat.vercel.app/](https://nexus-eight-lovat.vercel.app/)

## Features

- **User Management**: Create and manage team member accounts
- **Task Management**: Create, assign, and track tasks
- **Team Collaboration**: Add team members and assign roles
- **Email Notifications**: Automatic email notifications for new account creation
- **Real-time Updates**: Live updates for task status and team changes
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- React.js
- Redux Toolkit
- Tailwind CSS
- Vite
- React Router

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Nodemailer (Email functionality)

## Email Functionality

The application includes automatic email notifications when team member accounts are created. This feature:

- Sends welcome emails to new users
- Includes login credentials
- Uses professional HTML email templates
- Handles errors gracefully (registration continues even if email fails)

### Email Setup

1. Configure your Gmail account for SMTP access
2. Set up environment variables (see server/EMAIL_SETUP.md)
3. Test the email functionality using the provided test script

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Gmail account (for email functionality)

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```env
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-jwt-secret
   FRONTEND_URL=http://localhost:3000
   PORT=5000
   NODE_ENV=development
   
   # Email Configuration
   smtp_user=your-email@gmail.com
   smtp_pass=your-app-password
   ```

4. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```env
   VITE_APP_BACKEND_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
