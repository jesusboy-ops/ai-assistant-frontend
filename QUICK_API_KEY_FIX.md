# 🔑 QUICK FIX: API Key Disabled - 5 Minute Solution

## 🚨 PROBLEM
Your OpenRouter API key was automatically disabled for security after being exposed in Git. AI features are showing 401 errors.

## ⚡ QUICK SOLUTION (5 minutes)

### STEP 1: Get New API Key (2 minutes)
1. **Go to:** https://openrouter.ai/keys
2. **Delete old key:** `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`
3. **Click:** "Create Key"
4. **Copy:** The new key (starts with `sk-or-v1-`)

### STEP 2: Update Local Environment (1 minute)
1. **Open:** `spark-ai-assistant/.env.local`
2. **Replace:** `your_new_openrouter_api_key_here` with your new key
3. **Save** the file

### STEP 3: Update Vercel (2 minutes)
1. **Go to:** https://vercel.com/dashboard
2. **Select:** Your project
3. **Go to:** Settings → Environment Variables
4. **Update:** `VITE_OPENAI_API_KEY` with new key
5. **Click:** Save and Redeploy

## ✅ TEST
- **Local:** `npm run dev` → Test AI Chat
- **Production:** Wait for Vercel deployment → Test AI Chat

## 🎉 DONE!
Your AI features should work perfectly now!

---

**Why this happened:** OpenRouter automatically disables keys exposed in public repositories for security. This is actually a good thing - it protects you from unauthorized usage!