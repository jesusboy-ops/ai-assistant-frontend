# Security Best Practices

## API Key Management

### ⚠️ CRITICAL: Never Commit API Keys to Git

API keys should NEVER be committed to your repository. Follow these guidelines:

### 1. Use Environment Variables

Store sensitive data in environment files that are excluded from git:

- `.env.local` - For local development (gitignored)
- `.env.*.local` - For environment-specific configs (gitignored)

### 2. Use .env.example as Template

The `.env.example` file should contain:
- Variable names (what's needed)
- Placeholder values (not real keys)
- Comments explaining how to get the values

### 3. Configure .gitignore Properly

Ensure your `.gitignore` includes:
```
.env.local
.env.*.local
.env
*.local
```

### 4. Never Include Keys in Documentation

When writing documentation:
- ❌ DON'T: Show actual API keys
- ✅ DO: Use placeholders like `your_api_key_here`
- ✅ DO: Link to where users can get their own keys

### 5. If a Key is Exposed

If you accidentally commit an API key:

1. **Immediately revoke/disable the key** at the provider's dashboard
2. **Generate a new key**
3. **Remove the key from git history** (not just the latest commit)
4. **Update all environments** with the new key

### 6. Use Git History Cleaning Tools

If you've committed secrets, use:
- `git filter-branch` or `git filter-repo`
- BFG Repo-Cleaner
- GitHub's secret scanning alerts

### 7. Environment-Specific Configuration

#### Local Development
```bash
# Create .env.local (never commit this)
VITE_OPENAI_API_KEY=your_actual_key_here
```

#### Production (Vercel/Netlify)
Set environment variables in the hosting platform's dashboard:
- Vercel: Settings → Environment Variables
- Netlify: Site settings → Environment variables

## Additional Security Measures

### API Key Rotation
- Rotate API keys regularly (every 90 days recommended)
- Use different keys for development and production
- Monitor key usage for suspicious activity

### Access Control
- Limit API key permissions to only what's needed
- Use separate keys for different services
- Enable rate limiting when available

### Monitoring
- Set up alerts for unusual API usage
- Monitor your provider's dashboard regularly
- Check for security notifications from your git host

## Resources

- [OpenRouter API Keys](https://openrouter.ai/keys)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [Git Filter-Repo](https://github.com/newren/git-filter-repo)

---

**Remember**: Security is not a one-time setup. Review and update your security practices regularly.
