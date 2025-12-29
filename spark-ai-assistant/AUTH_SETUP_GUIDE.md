# Authentication Setup Guide

## 🔐 Setting Up Authentication for Spark AI Assistant

This guide will help you configure both email/password authentication and Google OAuth for your Spark AI Assistant.

---

## 📋 Prerequisites

1. **Backend Server**: You need a running backend server with authentication endpoints
2. **Google Cloud Project**: For Google OAuth integration
3. **Environment Variables**: Properly configured `.env` file

---

## 🚀 Quick Setup

### 1. Backend Configuration

Your backend must provide these authentication endpoints:

```
POST /api/auth/register     - User registration
POST /api/auth/login        - User login
POST /api/auth/oauth/google - Google OAuth login
GET  /api/auth/profile      - Get user profile
POST /api/auth/forgot-password - Password reset request
POST /api/auth/reset-password  - Password reset
```

### 2. Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env`:
```env
# Your backend API URL
VITE_API_BASE_URL=https://your-backend-url.com

# Google OAuth Client ID (optional)
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

### 3. Google OAuth Setup (Optional)

If you want to enable Google OAuth:

1. **Create Google Cloud Project**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable Google+ API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it

3. **Create OAuth 2.0 Credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add your domain to "Authorized JavaScript origins":
     ```
     http://localhost:5173
     http://localhost:5174
     https://your-domain.com
     ```

4. **Configure Client ID**:
   - Copy the Client ID from Google Cloud Console
   - Add it to your `.env` file:
     ```env
     VITE_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
     ```

---

## 🔧 Backend API Requirements

### Authentication Endpoints

Your backend should implement these endpoints:

#### 1. User Registration
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "jwt_token_here"
}
```

#### 2. User Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "jwt_token_here"
}
```

#### 3. Google OAuth Login
```http
POST /api/auth/oauth/google
Content-Type: application/json

{
  "idToken": "google_id_token_here"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "googleId": "google_user_id"
  },
  "token": "jwt_token_here"
}
```

#### 4. Get User Profile
```http
GET /api/auth/profile
Authorization: Bearer jwt_token_here
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

## 🛠️ Frontend Integration

The frontend is already configured to work with these endpoints. Here's how it works:

### 1. Email/Password Authentication
- Users can register with name, email, and password
- Login with email and password
- JWT token is stored in localStorage
- Token is sent with all API requests via Authorization header

### 2. Google OAuth Authentication
- Uses Google Sign-In JavaScript library
- Automatically handles OAuth flow
- Sends Google ID token to backend for verification
- Backend creates/finds user and returns JWT token

### 3. Protected Routes
- All dashboard routes require authentication
- Automatic redirect to login if not authenticated
- Token validation on app startup

---

## 🔍 Testing Authentication

### 1. Test Email Registration/Login
1. Start your backend server
2. Start the frontend: `npm run dev`
3. Navigate to `/signup`
4. Create a new account
5. Verify you're redirected to dashboard
6. Logout and login again

### 2. Test Google OAuth (if configured)
1. Ensure Google Client ID is set in `.env`
2. Navigate to `/login`
3. Click "Continue with Google"
4. Complete Google OAuth flow
5. Verify you're redirected to dashboard

---

## 🚨 Troubleshooting

### Common Issues:

#### 1. CORS Errors
**Problem**: Cannot connect to backend
**Solution**: Configure CORS in your backend to allow requests from your frontend domain

#### 2. Google OAuth Not Working
**Problem**: Google sign-in button doesn't appear
**Solutions**:
- Check if `VITE_GOOGLE_CLIENT_ID` is set correctly
- Verify domain is added to Google Cloud Console
- Check browser console for errors

#### 3. 401 Unauthorized Errors
**Problem**: API requests failing with 401
**Solutions**:
- Check if JWT token is being sent correctly
- Verify token hasn't expired
- Check backend JWT verification logic

#### 4. Network Errors
**Problem**: Cannot connect to backend
**Solutions**:
- Verify `VITE_API_BASE_URL` is correct
- Check if backend server is running
- Test backend endpoints directly with Postman/curl

---

## 📝 Security Best Practices

1. **JWT Tokens**: Use secure, short-lived tokens with refresh mechanism
2. **Password Hashing**: Use bcrypt or similar for password hashing
3. **HTTPS**: Always use HTTPS in production
4. **CORS**: Configure CORS properly to only allow your frontend domain
5. **Rate Limiting**: Implement rate limiting on auth endpoints
6. **Input Validation**: Validate all inputs on backend
7. **Google OAuth**: Verify Google ID tokens on backend

---

## 🎯 Next Steps

After setting up authentication:

1. **Test thoroughly** with different scenarios
2. **Configure password reset** functionality
3. **Set up email verification** (optional)
4. **Implement refresh tokens** for better security
5. **Add user profile management** features
6. **Configure production environment** variables

---

## 📞 Support

If you encounter issues:

1. Check the browser console for errors
2. Verify backend logs for API errors
3. Test backend endpoints independently
4. Check environment variables are loaded correctly
5. Ensure all dependencies are installed

The authentication system is now ready to work with a properly configured backend!