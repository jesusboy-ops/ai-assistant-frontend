# Vercel Deployment Guide

## Environment Variables Setup

After the deployment succeeds, you'll need to add these environment variables in your Vercel dashboard:

### Required Environment Variables

1. **VITE_GEMINI_API_KEY**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Add this key in Vercel dashboard

2. **VITE_GOOGLE_CLIENT_ID**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Navigate to APIs & Services > Credentials
   - Create OAuth 2.0 Client ID
   - Add your Vercel domain to authorized origins
   - Copy the Client ID

### How to Add Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project (spark-ai-assistant)
3. Go to Settings > Environment Variables
4. Add each variable:
   - Name: `VITE_GEMINI_API_KEY`
   - Value: Your Gemini API key
   - Environment: Production, Preview, Development
   
   - Name: `VITE_GOOGLE_CLIENT_ID`
   - Value: Your Google OAuth Client ID
   - Environment: Production, Preview, Development

### Pre-configured Variables

These are already set in the deployment:
- ✅ `VITE_API_BASE_URL`: https://ai-assistant-backend-oqpp.onrender.com
- ✅ `VITE_AI_MODEL`: gemini-1.5-flash

### After Adding Variables

1. Go to Deployments tab
2. Click "Redeploy" on the latest deployment
3. Your app will rebuild with the new environment variables

## Features Available After Deployment

- ✅ Task Management
- ✅ Life Admin Features
- ✅ Notes and Reminders
- ✅ Translation Services
- ✅ Math Calculator
- ✅ Document Summarizer
- ✅ Real-time Notifications
- ✅ Clean UI (no shadows/blur effects)
- ✅ Responsive Design

## Troubleshooting

If you encounter issues:
1. Check that all environment variables are set
2. Ensure your backend is running at the API URL
3. Verify Google OAuth is configured for your domain
4. Check browser console for any errors

## Security Notes

- Environment variables are securely stored in Vercel
- API keys are not exposed in the client-side code
- All sensitive data is handled server-side