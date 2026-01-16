# Vercel Environment Variables Setup

## Critical: Environment Variables Must Be Set in Vercel Dashboard

Vite environment variables **MUST** be set in the Vercel dashboard for production builds. The `vercel.json` file cannot inject them at build time.

## Required Environment Variables

Go to your Vercel project → Settings → Environment Variables and add:

### 1. OpenRouter API Key (Required for AI features)
```
Name: VITE_OPENAI_API_KEY
Value: sk-or-v1-YOUR_ACTUAL_OPENROUTER_API_KEY
Environment: Production, Preview, Development
```

### 2. Backend API URL
```
Name: VITE_API_BASE_URL
Value: https://ai-assistant-backend-oqpp.onrender.com
Environment: Production, Preview, Development
```

### 3. AI Model (Optional)
```
Name: VITE_OPENAI_MODEL
Value: gpt-3.5-turbo
Environment: Production, Preview, Development
```

### 4. Google OAuth (If using Google features)
```
Name: VITE_GOOGLE_CLIENT_ID
Value: your_google_client_id
Environment: Production, Preview, Development
```

## How to Add Environment Variables in Vercel

1. Go to https://vercel.com/dashboard
2. Select your project
3. Click on "Settings" tab
4. Click on "Environment Variables" in the left sidebar
5. Add each variable:
   - Enter the **Name** (e.g., `VITE_OPENAI_API_KEY`)
   - Enter the **Value** (your actual API key)
   - Select which environments to apply to (Production, Preview, Development)
   - Click "Save"

## Important Notes

- **All Vite environment variables MUST start with `VITE_`** to be exposed to the client
- Environment variables are injected at **build time**, not runtime
- After adding/changing environment variables, you **MUST redeploy** your application
- Never commit actual API keys to your repository

## Verification

After setting environment variables and redeploying:

1. Open browser console on your deployed site
2. Check for the API key status log: `🔑 API Key Status:`
3. It should show:
   - `exists: true`
   - `startsWithSk: true`
   - `isPlaceholder: false`

## Troubleshooting

### AI Features Not Working on Vercel

**Symptom:** AI chat, email generator, translator don't work on Vercel but work locally

**Solution:**
1. Verify `VITE_OPENAI_API_KEY` is set in Vercel dashboard
2. Make sure the value starts with `sk-or-v1-` (OpenRouter) or `sk-` (OpenAI)
3. Redeploy your application after adding the variable
4. Check browser console for error messages

### "API key not configured" Error

**Cause:** Environment variable not set or not prefixed with `VITE_`

**Solution:**
1. Go to Vercel dashboard → Settings → Environment Variables
2. Ensure variable name is exactly `VITE_OPENAI_API_KEY`
3. Ensure value is your actual API key (not placeholder)
4. Redeploy

### Changes Not Reflecting

**Cause:** Environment variables are injected at build time

**Solution:**
1. After changing any environment variable in Vercel
2. Go to Deployments tab
3. Click "Redeploy" on the latest deployment
4. Or push a new commit to trigger a rebuild

## Security Best Practices

- ✅ Use OpenRouter API keys (they're safer for client-side use)
- ✅ Set up usage limits on your OpenRouter account
- ✅ Monitor API usage regularly
- ✅ Never commit `.env` files with real keys
- ✅ Use different API keys for development and production
- ❌ Don't share API keys in screenshots or logs
- ❌ Don't use OpenAI keys directly in client-side code (use OpenRouter instead)

## Getting an OpenRouter API Key

1. Go to https://openrouter.ai/
2. Sign up for an account
3. Go to Keys section
4. Create a new API key
5. Copy the key (starts with `sk-or-v1-`)
6. Add it to Vercel environment variables as `VITE_OPENAI_API_KEY`

## After Setup

Once environment variables are properly configured:
- ✅ AI Chat will work
- ✅ Email Generator will work
- ✅ Translator will work
- ✅ All AI-powered features will function correctly

Remember: **Always redeploy after changing environment variables!**
