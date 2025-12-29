# CORS Troubleshooting Guide

## Current Issue

The backend server at `https://ai-assistant-backend-oqpp.onrender.com` is configured to only allow requests from `https://your-frontend-url.com`, but the frontend is running on `http://localhost:5174`.

## Error Message
```
Access to XMLHttpRequest at 'https://ai-assistant-backend-oqpp.onrender.com/api/health' from origin 'http://localhost:5174' has been blocked by CORS policy: The 'Access-Control-Allow-Origin' header has a value 'https://your-frontend-url.com' that is not equal to the supplied origin.
```

## Solution: Update Backend CORS Configuration

### Option 1: Allow Development Origin (Recommended)

Update your backend CORS configuration to include the development origin:

```javascript
// Express.js with cors middleware
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:5174',           // Development
    'http://localhost:3000',           // Alternative dev port
    'https://your-frontend-url.com',   // Production (replace with actual URL)
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

### Option 2: Environment-Based CORS

Use environment variables to configure CORS:

```javascript
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? ['https://your-production-domain.com']
  : ['http://localhost:5174', 'http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
```

### Option 3: Dynamic CORS (Most Flexible)

```javascript
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5174',
      'http://localhost:3000',
      'https://your-production-domain.com'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
```

## Environment Variables

Add these to your backend `.env` file:

```env
# CORS Configuration
CORS_ORIGIN=http://localhost:5174,https://your-production-domain.com
NODE_ENV=development
```

## Testing CORS Configuration

### 1. Check Current CORS Headers

```bash
curl -H "Origin: http://localhost:5174" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     https://ai-assistant-backend-oqpp.onrender.com/api/health
```

### 2. Expected Response Headers

The response should include:
```
Access-Control-Allow-Origin: http://localhost:5174
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

## Common CORS Middleware Examples

### Express.js
```javascript
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: ['http://localhost:5174', 'https://your-domain.com'],
  credentials: true,
}));
```

### Fastify
```javascript
await fastify.register(require('@fastify/cors'), {
  origin: ['http://localhost:5174', 'https://your-domain.com'],
  credentials: true,
});
```

### Next.js API Routes
```javascript
// pages/api/[...path].js
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5174');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Your API logic here
}
```

## Deployment Considerations

### Development
- Always include `http://localhost:5174` in allowed origins
- Consider allowing `http://localhost:3000` for alternative dev setups

### Production
- Replace `https://your-frontend-url.com` with your actual domain
- Remove localhost origins in production for security
- Use environment variables to manage different environments

### Render Deployment
If your backend is on Render, update the CORS configuration and redeploy:

1. Update your backend code with the correct CORS settings
2. Commit and push changes
3. Render will automatically redeploy
4. Test the frontend connection

## Security Notes

- Never use `origin: '*'` in production with `credentials: true`
- Always specify exact origins in production
- Use HTTPS in production
- Validate origins on the server side

## Quick Fix for Testing

For immediate testing, you can temporarily allow all origins (NOT for production):

```javascript
app.use(cors({
  origin: true, // Allows all origins
  credentials: true,
}));
```

**⚠️ Warning**: This is insecure and should only be used for testing!

## Verification Steps

1. Update backend CORS configuration
2. Redeploy backend
3. Clear browser cache
4. Test frontend connection
5. Check browser developer tools for CORS errors
6. Verify backend logs for incoming requests

## Contact Backend Developer

If you don't have access to the backend code, contact the backend developer with this information:

- **Frontend Origin**: `http://localhost:5174`
- **Required Headers**: `Content-Type`, `Authorization`
- **Required Methods**: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`
- **Credentials**: `true` (for JWT tokens)

The backend needs to be updated to allow requests from the frontend development server.