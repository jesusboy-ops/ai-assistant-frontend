# 🚨 URGENT: Backend CORS Configuration Fix Required

## Issue
The frontend at `http://localhost:5174` cannot connect to the backend at `https://ai-assistant-backend-oqpp.onrender.com` due to CORS policy restrictions.

## Current Error
```
Access to XMLHttpRequest at 'https://ai-assistant-backend-oqpp.onrender.com/api/health' from origin 'http://localhost:5174' has been blocked by CORS policy: The 'Access-Control-Allow-Origin' header has a value 'https://your-frontend-url.com' that is not equal to the supplied origin.
```

## Quick Fix Required

### Update CORS Configuration
Replace the current CORS configuration with:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5174',           // Frontend development server
    'http://localhost:3000',           // Alternative dev port
    'https://your-production-domain.com'  // Replace with actual production domain
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

### Environment-Based Solution (Recommended)
```javascript
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [process.env.FRONTEND_URL || 'https://your-production-domain.com']
  : ['http://localhost:5174', 'http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
```

### Environment Variables
Add to your backend `.env`:
```env
FRONTEND_URL=https://your-production-domain.com
NODE_ENV=development
```

## Testing
After updating, test with:
```bash
curl -H "Origin: http://localhost:5174" \
     -X OPTIONS \
     https://ai-assistant-backend-oqpp.onrender.com/api/health
```

Expected response should include:
```
Access-Control-Allow-Origin: http://localhost:5174
```

## Deployment
1. Update CORS configuration in your backend code
2. Commit and push changes
3. Render will automatically redeploy
4. Frontend will automatically reconnect

## Priority: HIGH
This blocks all frontend functionality including authentication, chat, and all API features.