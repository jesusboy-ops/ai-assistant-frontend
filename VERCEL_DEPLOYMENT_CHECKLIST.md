# Vercel Deployment Checklist ✅

## Before Deploying

- [ ] Have your OpenRouter API key ready (get from https://openrouter.ai/keys)
- [ ] Have your backend API URL ready
- [ ] Committed all code changes to Git
- [ ] Tested locally with `npm run dev`

## Step 1: Set Environment Variables in Vercel Dashboard

**CRITICAL:** You must set these in Vercel Dashboard, NOT in code!

1. Go to https://vercel.com/dashboard
2. Select your project: `ai-assistant-frontend`
3. Click **Settings** → **Environment Variables**
4. Add these variables:

### Required Variables:

| Variable Name | Value | Environments |
|--------------|-------|--------------|
| `VITE_OPENAI_API_KEY` | `sk-or-v1-YOUR_KEY` | Production, Preview, Development |
| `VITE_API_BASE_URL` | `https://ai-assistant-backend-oqpp.onrender.com` | Production, Preview, Development |

### Optional Variables:

| Variable Name | Value | Environments |
|--------------|-------|--------------|
| `VITE_OPENAI_MODEL` | `gpt-3.5-turbo` | Production, Preview, Development |
| `VITE_GOOGLE_CLIENT_ID` | Your Google Client ID | Production, Preview, Development |

## Step 2: Deploy to Vercel

### Option A: Deploy via Git (Recommended)

```bash
# Commit your changes
git add .
git commit -m "Configure for Vercel deployment"
git push origin main
```

Vercel will automatically detect the push and deploy.

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Deploy
cd spark-ai-assistant
vercel --prod
```

## Step 3: Verify Deployment

After deployment completes:

1. **Open your deployed site** (e.g., https://your-app.vercel.app)
2. **Open browser console** (F12 → Console tab)
3. **Look for these logs:**
   ```
   🔑 API Key Status: { exists: true, startsWithSk: true, isPlaceholder: false }
   ```
4. **Test AI features:**
   - Go to Chat page
   - Send a message like "Hi"
   - Should get AI response
   - Go to Emails page
   - Try generating an email
   - Should work

## Troubleshooting

### ❌ AI Features Not Working

**Check 1: Environment Variables**
- Go to Vercel Dashboard → Settings → Environment Variables
- Verify `VITE_OPENAI_API_KEY` exists and has correct value
- Verify it's applied to "Production" environment

**Check 2: Redeploy**
- After adding/changing environment variables
- Go to Deployments tab
- Click "Redeploy" on latest deployment

**Check 3: Browser Console**
- Open browser console on deployed site
- Look for error messages
- Check the `🔑 API Key Status` log

### ❌ "API key not configured" Error

**Solution:**
1. Environment variable name must be exactly: `VITE_OPENAI_API_KEY`
2. Value must start with `sk-or-v1-` (OpenRouter) or `sk-` (OpenAI)
3. Must be set in Vercel Dashboard (not in code)
4. Must redeploy after adding

### ❌ Works Locally But Not on Vercel

**Cause:** Environment variables not set in Vercel Dashboard

**Solution:**
1. Local `.env.local` file is NOT used by Vercel
2. Must set variables in Vercel Dashboard
3. See Step 1 above

### ❌ 404 Errors on Page Refresh

**Solution:** Already configured in `vercel.json` with rewrites

### ❌ Build Fails

**Check:**
- Build command in `vercel.json`: `cd spark-ai-assistant && npm run build`
- Output directory: `spark-ai-assistant/dist`
- All dependencies in `package.json`

## Post-Deployment

### Monitor Your Deployment

1. **Check Vercel Dashboard:**
   - Deployments tab shows build logs
   - Functions tab shows serverless function logs
   - Analytics tab shows traffic

2. **Monitor API Usage:**
   - Go to https://openrouter.ai/activity
   - Check your API usage and costs
   - Set up usage alerts

3. **Test All Features:**
   - [ ] Login/Signup works
   - [ ] AI Chat responds
   - [ ] Email generator works
   - [ ] Translator works
   - [ ] Notes save correctly
   - [ ] Calendar loads
   - [ ] Tasks work
   - [ ] All pages load without errors

## Security Checklist

- [ ] API keys are set in Vercel Dashboard (not in code)
- [ ] `.env.local` is in `.gitignore`
- [ ] No API keys committed to Git
- [ ] OpenRouter usage limits configured
- [ ] HTTPS is enabled (automatic on Vercel)

## Performance Optimization

- [ ] Images are optimized
- [ ] Code splitting is working (check Network tab)
- [ ] Lazy loading for routes
- [ ] Service worker for offline support (if enabled)

## Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **OpenRouter Docs:** https://openrouter.ai/docs
- **Vite Env Docs:** https://vitejs.dev/guide/env-and-mode.html

## Quick Commands

```bash
# View deployment logs
vercel logs

# List deployments
vercel ls

# Open project in browser
vercel open

# Check environment variables
vercel env ls
```

---

**Remember:** After changing ANY environment variable in Vercel Dashboard, you MUST redeploy!
