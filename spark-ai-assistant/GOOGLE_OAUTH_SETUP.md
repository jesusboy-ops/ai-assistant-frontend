# Google OAuth Setup Guide 🔐

## Current Status

**Google OAuth Configuration:** ❌ Not properly configured  
**Current Client ID:** `your_google_client_id_here.apps.googleusercontent.com`  
**Status:** Placeholder value - Google authentication will not work

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: "Spark AI Assistant"
4. Click "Create"

### Step 2: Enable Required APIs
1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google+ API" or "Google Identity API"
3. Click on it and press "Enable"

### Step 3: Configure OAuth Consent Screen
1. Go to "APIs & Services" → "OAuth consent screen"
2. Choose "External" user type (unless you have Google Workspace)
3. Fill in required fields:
   - App name: "Spark AI Assistant"
   - User support email: Your email
   - Developer contact information: Your email
4. Click "Save and Continue" through all steps
5. Add test users if needed (for development)

### Step 4: Create OAuth Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Choose "Web application" as application type
4. Add these to "Authorized JavaScript origins":
   ```
   http://localhost:5173
   http://localhost:5174
   https://your-production-domain.com
   ```
5. Leave "Authorized redirect URIs" empty (not needed for this setup)
6. Click "Create"

### Step 5: Configure Your App
1. Copy the Client ID from Google Cloud Console
2. Open your `.env` file in the project root
3. Replace the placeholder:
   ```env
   VITE_GOOGLE_CLIENT_ID=your_actual_client_id_here.apps.googleusercontent.com
   ```
4. Restart your development server: `npm run dev`

---

## 🔧 Testing Without Real Configuration

If you want to test the UI without setting up Google OAuth:

**Option A: Use Demo Mode**
The app will show Google buttons but they won't work. This is useful for UI testing.

**Option B: Skip Google OAuth**
You can still use email/password authentication without Google OAuth.

---

## ✅ Verification Steps

After completing the setup:

1. **Check Environment**: Verify `.env` file has real Client ID
2. **Restart Server**: Stop and restart your development server
3. **Test Login**: Go to login page and click "Continue with Google"
4. **Check Console**: Look for any errors in browser developer console

### Expected Behavior:
- ✅ Google sign-in button should be enabled and clickable
- ✅ Clicking should open Google OAuth popup/redirect
- ✅ After Google authentication, user should be logged into the app
- ✅ User profile should show Google account information

---

## 🚨 Common Issues & Solutions

### "Google Sign-In not available"
- **Cause**: Client ID not set or invalid
- **Fix**: Check `.env` file and restart server

### "Invalid Client ID" Error
- **Cause**: Wrong Client ID or not copied correctly
- **Fix**: Re-copy Client ID from Google Cloud Console

### OAuth Popup Blocked
- **Cause**: Browser blocking popups
- **Fix**: Allow popups for your domain

### "Origin not allowed" Error
- **Cause**: Your domain not in authorized origins
- **Fix**: Add your domain to Google Cloud Console authorized origins

### Google OAuth Flow Fails
- **Cause**: OAuth consent screen not configured
- **Fix**: Complete OAuth consent screen setup in Google Cloud Console

---

## 🔒 Security Notes

1. **Never commit real Client IDs** to public repositories
2. **Use environment variables** for all sensitive configuration
3. **Restrict authorized origins** to only your actual domains
4. **Regularly rotate credentials** if compromised

---

## 🎯 Next Steps

Once Google OAuth is working:

1. **Test thoroughly** with different Google accounts
2. **Set up production environment** with production domain
3. **Configure user roles** and permissions as needed
4. **Monitor authentication logs** for any issues

---

## 📞 Need Help?

If you're still having issues:

1. Check the browser console for detailed error messages
2. Verify all steps were completed correctly
3. Test with a fresh incognito/private browser window
4. Make sure your Google account has the necessary permissions

The Google OAuth integration should work seamlessly once properly configured!