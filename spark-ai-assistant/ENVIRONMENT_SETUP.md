# Environment Variables Setup Guide

## Security Notice
**NEVER commit API keys to the repository!** This guide shows you how to set up environment variables securely.

## Local Development Setup

1. **Create a `.env.local` file** in the `spark-ai-assistant` directory:
   ```bash
   # This file is automatically ignored by git
   VITE_OPENAI_API_KEY=your_actual_openrouter_api_key_here
   ```

2. **Get your OpenRouter API Key:**
   - Go to [openrouter.ai](https://openrouter.ai)
   - Sign up or log in
   - Go to [Keys](https://openrouter.ai/keys)
   - Create a new API key
   - Copy the key (starts with `sk-or-v1-`)

3. **Replace the placeholder** in `.env.local` with your actual key

## Production Deployment (Vercel)

1. **Go to your Vercel dashboard**
2. **Select your project**
3. **Go to Settings > Environment Variables**
4. **Add the following variables:**
   - Name: `VITE_OPENAI_API_KEY`
   - Value: Your actual OpenRouter API key
   - Environment: Production (and Preview if needed)

## Other Deployment Platforms

### Netlify
1. Go to Site Settings > Environment Variables
2. Add `VITE_OPENAI_API_KEY` with your API key

### Railway
1. Go to your project settings
2. Add environment variable `VITE_OPENAI_API_KEY`

### Heroku
1. Go to Settings > Config Vars
2. Add `VITE_OPENAI_API_KEY` with your API key

## Testing Your Setup

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Check the browser console** - you should see:
   ```
   🔑 API Key configured: true
   🔑 Using OpenRouter: true
   ```

3. **Test the AI chat** - it should work without API key errors

## Troubleshooting

### "AI service is not configured" Error
- Check that your `.env.local` file exists
- Verify the API key is correct and starts with `sk-or-v1-`
- Restart your development server after adding the key

### API Key Disabled by OpenRouter
- OpenRouter automatically disables keys found in public repositories
- Create a new API key at [openrouter.ai/keys](https://openrouter.ai/keys)
- Update your environment variables (never commit to git)

### Production Deployment Issues
- Verify environment variables are set in your deployment platform
- Check that the variable name is exactly `VITE_OPENAI_API_KEY`
- Redeploy after setting environment variables

## File Structure
```
spark-ai-assistant/
├── .env                 # Template with placeholders (committed)
├── .env.local          # Your actual keys (NOT committed)
├── .env.example        # Example file (committed)
└── .gitignore          # Includes *.local pattern
```

## Security Best Practices

1. **Never commit real API keys** to version control
2. **Use environment variables** for all sensitive data
3. **Rotate API keys regularly** for security
4. **Monitor API usage** to detect unauthorized access
5. **Use different keys** for development and production

## Need Help?

If you're still having issues:
1. Check the browser console for error messages
2. Verify your API key is active at [openrouter.ai/keys](https://openrouter.ai/keys)
3. Make sure you have credits/usage available on OpenRouter
4. Contact support if the issue persists