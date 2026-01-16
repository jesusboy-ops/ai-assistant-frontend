# Fix API Key on Vercel - Step by Step

## The Problem
Your OpenRouter API key works locally but not on Vercel because environment variables must be set separately in Vercel's dashboard.

## Solution: Add Environment Variable to Vercel

### Step 1: Go to Vercel Dashboard
1. Open https://vercel.com/dashboard
2. Find and click on your project: `ai-assistant-frontend` (or whatever your project is named)

### Step 2: Navigate to Environment Variables
1. Click on **Settings** tab (top navigation)
2. Click on **Environment Variables** in the left sidebar

### Step 3: Add the API Key
1. Click the **Add New** button
2. Fill in the form:
   - **Key (Name)**: `VITE_OPENAI_API_KEY`
   - **Value**: `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`
   - **Environments**: Check all three boxes:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
3. Click **Save**

### Step 4: Redeploy Your Application
After adding the environment variable, you MUST redeploy for it to take effect:

**Option A: Redeploy from Dashboard**
1. Go to the **Deployments** tab
2. Find the latest deployment
3. Click the three dots (...) menu on the right
4. Click **Redeploy**
5. Confirm the redeployment

**Option B: Push a New Commit**
```bash
# Make a small change (like adding a comment) and push
git add .
git commit -m "Trigger redeploy for env vars"
git push origin main
```

### Step 5: Verify It's Working
1. Wait for the deployment to complete (usually 1-2 minutes)
2. Visit your deployed site
3. Open the browser console (F12)
4. Look for the debug logs:
   ```
   🔑 API Key Status: { exists: true, length: 85, startsWithSk: true, isPlaceholder: false }
   🔑 isApiKeyConfigured: true
   ```
5. Try sending a message in the chat to test the AI response

## Common Issues & Solutions

### Issue 1: "Still showing API key not configured"
**Solution**: Make sure you redeployed AFTER adding the environment variable. Environment variables are only loaded during build time.

### Issue 2: "Variable name is wrong"
**Solution**: The variable name MUST be exactly `VITE_OPENAI_API_KEY` (case-sensitive). Vite requires the `VITE_` prefix for environment variables to be exposed to the client.

### Issue 3: "Works in preview but not production"
**Solution**: Make sure you checked the "Production" checkbox when adding the environment variable. You may need to add it separately for each environment.

### Issue 4: "Console shows 'undefined' for API key"
**Solution**: 
1. Verify the variable name is exactly `VITE_OPENAI_API_KEY`
2. Make sure you redeployed after adding the variable
3. Check that the variable is set for the correct environment (Production/Preview)

## Quick Verification Checklist

Before you start:
- [ ] I have the new API key: `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`
- [ ] I'm logged into Vercel dashboard

Adding the variable:
- [ ] Opened project settings in Vercel
- [ ] Navigated to Environment Variables
- [ ] Added `VITE_OPENAI_API_KEY` as the key name
- [ ] Pasted the full API key as the value
- [ ] Selected all three environments (Production, Preview, Development)
- [ ] Clicked Save

After adding:
- [ ] Redeployed the application
- [ ] Waited for deployment to complete
- [ ] Tested the chat functionality
- [ ] Checked browser console for API key status logs

## Screenshot Guide

If you need visual help, here's what to look for:

1. **Settings Tab**: Top of the page, next to "Deployments" and "Analytics"
2. **Environment Variables**: Left sidebar under "Project Settings"
3. **Add New Button**: Top right of the Environment Variables page
4. **Form Fields**: 
   - First field: Variable name
   - Second field: Variable value
   - Checkboxes: Which environments to apply to

## Need More Help?

If you're still having issues after following these steps:

1. Check the Vercel deployment logs:
   - Go to Deployments tab
   - Click on the latest deployment
   - Look for any build errors

2. Verify the API key is valid:
   - Go to https://openrouter.ai/keys
   - Check that your key is active and has credits

3. Test locally first:
   - Make sure it works on your local machine
   - If local doesn't work, the issue is with the key itself

## Important Notes

- Environment variables in Vercel are separate from your local `.env.local` file
- The `.env.local` file is NOT deployed to Vercel (it's in .gitignore)
- You must set environment variables in Vercel's dashboard for production
- Changes to environment variables require a redeploy to take effect
- The `VITE_` prefix is required for Vite to expose variables to the browser

---

**Your new API key**: `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`

**Variable name to use**: `VITE_OPENAI_API_KEY`
