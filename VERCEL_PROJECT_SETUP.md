# Vercel Project Configuration

## Important: Root Directory Setting

When setting up your project in Vercel, you MUST configure the root directory:

### Step 1: Project Settings

1. Go to Vercel Dashboard → Your Project → Settings
2. Click on **General** in the left sidebar
3. Find **Root Directory** section
4. Click **Edit**
5. Enter: `spark-ai-assistant`
6. Click **Save**

### Step 2: Build Settings (Should Auto-Detect)

Vercel should automatically detect these from `vercel.json`:

- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

If not auto-detected, set them manually in Settings → General → Build & Development Settings.

### Step 3: Environment Variables

Go to Settings → Environment Variables and add:

```
VITE_OPENAI_API_KEY=sk-or-v1-your_key_here
VITE_API_BASE_URL=https://ai-assistant-backend-oqpp.onrender.com
```

Apply to: Production, Preview, Development

### Step 4: Deploy

After configuring:
1. Go to Deployments tab
2. Click "Redeploy" on the latest deployment
3. Or push a new commit to trigger deployment

## Troubleshooting

### Error: "Could not read package.json"

**Cause:** Root directory not set to `spark-ai-assistant`

**Solution:**
1. Settings → General → Root Directory
2. Set to: `spark-ai-assistant`
3. Save and redeploy

### Error: "Node.js version changed"

**Cause:** Vercel cache issue

**Solution:**
1. Settings → General → Node.js Version
2. Set to: `20.x` (recommended)
3. Redeploy

### Build Fails

**Check:**
1. Root directory is set to `spark-ai-assistant`
2. Build command is `npm run build`
3. Output directory is `dist`
4. All environment variables are set

## Quick Setup Checklist

- [ ] Root Directory: `spark-ai-assistant`
- [ ] Framework: Vite (auto-detected)
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Environment Variable: `VITE_OPENAI_API_KEY` set
- [ ] Environment Variable: `VITE_API_BASE_URL` set
- [ ] Redeployed after configuration

---

**After completing these steps, your deployment should work correctly!**
