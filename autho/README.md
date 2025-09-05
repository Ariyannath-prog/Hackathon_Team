# Auth App Setup Guide

A complete authentication system with Node.js/Express backend, PostgreSQL database, and Google OAuth integration.

## Features

- ✅ User registration and login with email/password
- ✅ Google OAuth integration
- ✅ PostgreSQL database integration
- ✅ Session management
- ✅ Responsive UI with modals
- ✅ User profile management
- ✅ Secure password hashing with bcrypt

## Prerequisites

Before running this application, make sure you have:

1. **Node.js** (v14 or higher) installed
2. **PostgreSQL** database running
3. **Google OAuth credentials** (already provided in your case)

## Installation Steps

### 1. Clone/Download the Project

Create a new directory and add all the provided files:

```
project-folder/
├── server.js
├── package.json
├── .env
└── public/
    ├── index.html
    ├── styles.css
    └── script.js
```

### 2. Install Dependencies

Open terminal in your project folder and run:

```bash
npm install
```

### 3. Database Setup

Make sure PostgreSQL is running on your system, then:

1. Create the database (if not exists):
```sql
CREATE DATABASE secrets1;
```

2. The application will automatically create the `users` table when you first run it.

### 4. Environment Variables

The `.env` file is already configured with your credentials:

```env
GOOGLE_CLIENT_ID="560768197808-mur1p64ibglu85dndtbrf7qhdioa82i6.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="7OOLrGhqBgWoO1XBVBXhGO8q"
PG_USER="postgres"
PG_HOST="localhost"
PG_DATABASE="secrets1"
PG_PASSWORD="chandanchetia09"
PG_PORT="5432"
```

### 5. Google OAuth Setup

Your Google OAuth credentials are already configured. Make sure to:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Find your project with the client ID: `560768197808-mur1p64ibglu85dndtbrf7qhdioa82i6`
3. Add `http://localhost:3000/auth/google/callback` to authorized redirect URIs
4. Add `http://localhost:3000` to authorized JavaScript origins

## Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The application will be available at: **http://localhost:3000**

## How to Use

### 1. Registration
- Click "Sign Up" button in the navigation
- Fill in your details (name, email, password)
- Or click "Continue with Google" for OAuth signup

### 2. Login
- Click "Login" button in the navigation
- Enter your email and password
- Or use Google OAuth login

### 3. Profile Management
- After login, your profile picture appears in the top-right corner
- Click on the profile picture to view your profile details
- Use the dropdown to access profile or logout

## File Structure

```
├── server.js              # Express server with authentication routes
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables
└── public/
    ├── index.html         # Main HTML file with modals
    ├── styles.css         # Responsive CSS styling
    └── script.js          # Frontend JavaScript logic
```

## Database Schema

The `users` table structure:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    name VARCHAR(255),
    google_id VARCHAR(255) UNIQUE,
    profile_picture VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

- `POST /api/signup` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/user` - Get current user info
- `GET /auth/google` - Google OAuth login
- `GET /auth/google/callback` - Google OAuth callback

## Security Features

- Password hashing with bcrypt (10 salt rounds)
- Session-based authentication
- CSRF protection through session management
- Input validation and sanitization
- Secure OAuth implementation

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify PostgreSQL is running
   - Check database credentials in `.env`
   - Ensure database `secrets1` exists

2. **Google OAuth Not Working**
   - Verify redirect URIs in Google Console
   - Check client ID and secret in `.env`
   - Clear browser cache and cookies

3. **Port Already in Use**
   - Change port in `server.js`: `const port = 3001;`
   - Or kill the process using port 3000

4. **Module Not Found**
   - Run `npm install` to install all dependencies
   - Check if all files are in correct locations

### Development Tips

- Use `npm run dev` for auto-restart during development
- Check browser console for frontend errors
- Check terminal console for backend errors
- Use PostgreSQL admin tools to view database contents

## License

MIT License - Feel free to use and modify as needed.