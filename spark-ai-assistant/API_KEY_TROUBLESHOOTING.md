# API Key Troubleshooting Guide

## Error: "AI service is not configured. Please set up your OpenRouter API key"

This error means the application cannot find your OpenRouter API key. Here's how to fix it:

---

## For Local Development

### Step 1: Check if .env.local exists
The file `spark-ai-assistant/.env.local` should exist with your API key.

### Step 2: Verify the content
Open `.env.local` and make sure it contains:
```
VITE_OPENAI_API_KEY=your_actual_openrouter_api_key_here
```

**IMPORTANT**: Replace `your_actual_openrouter_api_key_here` with your real OpenRouter API key from https://openrouter.ai/keys

### Step 3: Restart your development server
**This is the most common fix!**

1. Stop your dev server (Ctrl+C in terminal)
2. Start it again:
   ```bash
   npm run dev
   ```

Environment variables are only loaded when the server starts, so you MUST restart after creating or modifying .env.local.

### Step 4: Check browser console
Open browser DevTools (F12) and look for:
```
🔑 API Key Status: { exists: true, length: 85, startsWithSk: true, isPlaceholder: false }
🔑 isApiKeyConfigured: true
```

If you see `exists: false`, the .env.local file is not being read.

---

## For Production (Vercel)

### Step 1: Add Environment Variable in Vercel
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Set:
   - **Name**: `VITE_OPENAI_API_KEY`
   - **Value**: `your_actual_openrouter_api_key_here`
   - **Environment**: Production (and Preview if needed)
   
   **IMPORTANT**: Use your real OpenRouter API key from https://openrouter.ai/keys
6. Click **Save**

### Step 2: Redeploy
After adding the environment variable, you MUST redeploy:
1. Go to **Deployments** tab
2. Click the three dots on the latest deployment
3. Click **Redeploy**

OR push a new commit to trigger automatic deployment.

---

## Common Issues

### Issue 1: "API key not found after restart"
**Solution**: Make sure the file is named exactly `.env.local` (with the dot at the start) and is in the `spark-ai-assistant` folder, not the root folder.

### Issue 2: "Works locally but not on Vercel"
**Solution**: Environment variables must be set separately in Vercel. The .env.local file is not deployed (it's in .gitignore for security).

### Issue 3: "API key shows as placeholder"
**Solution**: Check that you don't have a `.env` file overriding the `.env.local` file. Vite loads files in this order:
1. `.env.local` (highest priority)
2. `.env`

### Issue 4: "Still not working after everything"
**Solution**: 
1. Clear browser cache and localStorage
2. Check browser console for the debug logs
3. Verify the API key is active at https://openrouter.ai/keys
4. Make sure you have credits/usage available on OpenRouter

---

## Quick Test

Run this in your browser console while on the app:
```javascript
console.log('API Key:', import.meta.env.VITE_OPENAI_API_KEY?.substring(0, 10) + '...');
```

You should see: `API Key: sk-or-v1-6...`

If you see `undefined`, the environment variable is not loaded.

---

## Need More Help?

1. Check the browser console for error messages
2. Look for the 🔑 debug logs
3. Verify your OpenRouter account has credits
4. Make sure the API key hasn't been disabled by OpenRouter