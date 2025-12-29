# 🚀 AI Quick Start Guide

## ⚡ Get AI Working in 2 Minutes

### 1. **Get API Key** (30 seconds)
- Go to: https://huggingface.co/settings/tokens
- Click "New token" → Choose "Read" → Copy token

### 2. **Add to Environment** (30 seconds)
```bash
# Edit .env file
VITE_HUGGING_FACE_API_KEY=hf_your_token_here
```

### 3. **Test AI** (1 minute)
- Start app: `npm run dev`
- Go to Dashboard
- Find "Hugging Face AI Test" section
- Click "Test Hugging Face Connection"
- ✅ Should show success!

## 🎯 Where to Use AI

| Feature | Location | What It Does |
|---------|----------|--------------|
| **AI Chat** | `/chat` | Smart conversations with AI |
| **AI Translation** | `/translator` | Fallback when other APIs fail |
| **AI Testing** | Dashboard | Test all AI features |

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| "API key not configured" | Add `VITE_HUGGING_FACE_API_KEY` to `.env` |
| "No valid response" | Wait 10 seconds (model loading) |
| Connection failed | Check internet + API key validity |

## ✅ Success Indicators

- **Chat**: AI responds to messages
- **Translation**: Shows "Method: ai_powered" 
- **Test**: Green checkmark on connection test

---

**🎉 That's it! Your AI is now powered by Hugging Face and ready to use.**