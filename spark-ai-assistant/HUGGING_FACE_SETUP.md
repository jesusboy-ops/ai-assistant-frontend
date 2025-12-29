# Hugging Face AI Integration Setup

## Overview

The Spark AI Assistant now uses Hugging Face's Inference API instead of Google Gemini for better reliability and cost-effectiveness. This provides AI-powered chat responses, translation fallbacks, and email generation.

## Features

✅ **AI Chat Responses** - Intelligent conversation using multiple Hugging Face models
✅ **Translation Fallback** - AI-powered translation when external APIs fail  
✅ **Email Generation** - AI-assisted email composition
✅ **Multiple Model Support** - Automatic fallback between models for reliability
✅ **Connection Testing** - Built-in API connectivity verification

## Setup Instructions

### 1. Get Hugging Face API Key

1. Visit [Hugging Face](https://huggingface.co/)
2. Create a free account or sign in
3. Go to [Settings > Access Tokens](https://huggingface.co/settings/tokens)
4. Click "New token"
5. Choose "Read" permissions (sufficient for inference)
6. Copy your API key

### 2. Configure Environment Variables

Update your `.env` file:

```bash
# AI API Configuration - Hugging Face
VITE_HUGGING_FACE_API_KEY=hf_your_actual_api_key_here
VITE_HUGGING_FACE_MODEL=microsoft/DialoGPT-medium
```

**Important:** Replace `hf_your_actual_api_key_here` with your actual Hugging Face API key.

### 3. Supported Models

The system automatically tries multiple models for reliability:

- **microsoft/DialoGPT-medium** (Primary) - Conversational AI
- **facebook/blenderbot-400M-distill** (Fallback) - Chat responses  
- **microsoft/DialoGPT-small** (Backup) - Lightweight conversations

### 4. Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to the Dashboard
3. Scroll down to find the "Hugging Face AI Test" component
4. Click "Test Hugging Face Connection" to verify setup
5. Try the chat response, translation, and email generation tests

## Usage in Application

### Chat Feature
- Navigate to `/chat`
- Start a new conversation
- The AI will respond using Hugging Face models
- Fallback to contextual responses if API fails

### Translator Feature  
- Navigate to `/translator`
- Enter text to translate
- If external translation APIs fail, AI translation kicks in automatically
- Look for "Method: ai_powered" in the response

### Email Generation
- Available through the AI API for future email features
- Generates professional emails based on prompts

## API Endpoints Used

- **Base URL:** `https://api-inference.huggingface.co/models`
- **Authentication:** Bearer token in headers
- **Rate Limits:** Free tier includes generous limits
- **Models:** Multiple models for redundancy

## Troubleshooting

### Connection Issues

**Problem:** "Hugging Face API key not configured"
**Solution:** Ensure your `.env` file has the correct API key

**Problem:** "No valid response from any AI model"  
**Solution:** Check your internet connection and API key validity

**Problem:** Models are slow or timing out
**Solution:** The system automatically waits for models to load (cold start)

### Testing

Use the built-in test component on the Dashboard to:
- ✅ Verify API connectivity
- ✅ Test chat responses
- ✅ Test translation capabilities  
- ✅ Test email generation
- ✅ Check configuration status

### Fallback Behavior

The system gracefully handles failures:
1. **Primary Model Fails** → Try secondary models
2. **All Models Fail** → Use contextual mock responses
3. **API Key Missing** → Show helpful error messages
4. **Network Issues** → Provide offline functionality

## Cost and Limits

- **Free Tier:** 30,000 characters/month
- **Pro Tier:** $9/month for higher limits
- **Enterprise:** Custom pricing for high volume

The free tier is sufficient for development and moderate usage.

## Migration from Google Gemini

The old Google Gemini configuration is automatically disabled:

```bash
# Legacy Google Gemini (deprecated)
# VITE_GEMINI_API_KEY=...
# VITE_AI_MODEL=...
```

All existing functionality continues to work with the new Hugging Face integration.

## Security Notes

- API keys are client-side environment variables
- For production, consider server-side proxy for API calls
- Never commit API keys to version control
- Use different API keys for development/production

## Support

- **Hugging Face Docs:** https://huggingface.co/docs/api-inference
- **Model Hub:** https://huggingface.co/models
- **Community:** https://discuss.huggingface.co/

---

**Status:** ✅ Ready for use
**Last Updated:** December 2024
**Version:** 1.0.0