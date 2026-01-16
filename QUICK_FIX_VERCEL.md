# Quick Fix: API Key Not Working on Vercel

## What's Wrong?
Your API key works locally but not on Vercel because environment variables need to be set in Vercel's dashboard.

## Quick Fix (5 minutes)

### 1. Add Environment Variable in Vercel
1. Go to https://vercel.com/dashboard
2. Click your project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Enter:
   - **Name**: `VITE_OPENAI_API_KEY`
   - **Value**: `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`
   - **Environments**: Check all (Production, Preview, Development)
6. Click **Save**

### 2. Redeploy
Go to **Deployments** → Click (...) on latest → **Redeploy**

### 3. Test
Wait 1-2 minutes, then visit your site and try the chat.

## Verify It's Working
Open browser console (F12) and look for:
```
🔍 Environment Debug Info
  🔑 API Key Analysis
    Exists: true
    Is configured: true
```

## Still Not Working?

### Check These:
1. Variable name is exactly `VITE_OPENAI_API_KEY` (case-sensitive)
2. You redeployed AFTER adding the variable
3. The deployment completed successfully
4. You're testing the production URL (not localhost)

### Get More Help:
See `VERCEL_API_KEY_FIX.md` for detailed troubleshooting.

---

**Your API Key**: `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`
