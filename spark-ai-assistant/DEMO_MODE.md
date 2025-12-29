# Demo Mode Guide

## 🎯 What is Demo Mode?

Demo Mode allows you to test and explore the Spark AI Assistant frontend **without needing a backend API**. This is perfect for:
- Testing the UI/UX
- Demonstrating the application
- Development and design work
- Learning the codebase

## ✅ Current Status

**Demo Mode is ENABLED** - You can now login and use the application!

## 🚀 How to Use Demo Mode

### Login
1. Go to http://localhost:5174/login
2. Enter **any email address** (e.g., demo@test.com)
3. Enter **any password** (e.g., password123)
4. Click "Sign In"
5. You'll be logged in and redirected to the dashboard!

### Signup
1. Go to http://localhost:5174/signup
2. Enter **any name, email, and password**
3. Click "Create Account"
4. You'll be registered and redirected to the dashboard!

## 🎨 What Works in Demo Mode

✅ **Authentication**
- Login with any credentials
- Signup with any details
- Logout functionality
- Protected routes

✅ **UI/UX**
- All pages are accessible
- Navigation works
- Forms validate properly
- Responsive design
- Dark/Light mode themes

✅ **State Management**
- Redux state updates
- Local state management
- Form state handling

⚠️ **What Doesn't Work**
- Actual API calls (no backend)
- Data persistence (refreshing loses data)
- Real AI responses
- Email sending
- File uploads to server

## 🔧 Disabling Demo Mode

When you have a backend API ready:

### Step 1: Update Configuration
Edit `src/config/demo.js`:
```javascript
export const DEMO_MODE = false; // Change to false
```

### Step 2: Update Environment Variables
Edit `.env`:
```env
VITE_API_BASE_URL=http://your-backend-url:3000
```

### Step 3: Restart Dev Server
```bash
# Stop the current server (Ctrl+C)
npm run dev
```

## 📝 Demo Mode Features

### Authentication
- Simulates successful login/registration
- Creates a demo user with your email
- Generates a demo JWT token
- Stores in Redux and localStorage
- 500ms delay to simulate network request

### User Data
When you login with `demo@test.com`, you get:
```javascript
{
  id: 'demo_user_123',
  email: 'demo@test.com',
  name: 'demo',
  token: 'demo_token_1234567890'
}
```

## 🎯 Testing Scenarios

### Test Login Flow
1. Visit `/login`
2. Enter: `test@example.com` / `password123`
3. Click "Sign In"
4. ✅ Should redirect to `/dashboard`

### Test Signup Flow
1. Visit `/signup`
2. Enter: `John Doe` / `john@example.com` / `Password123`
3. Click "Create Account"
4. ✅ Should redirect to `/dashboard`

### Test Protected Routes
1. Without logging in, try to visit `/dashboard`
2. ✅ Should redirect to `/login`
3. After logging in, visit `/dashboard`
4. ✅ Should show dashboard

### Test Logout
1. Login first
2. Click logout in sidebar
3. ✅ Should redirect to `/login`
4. Try to visit `/dashboard`
5. ✅ Should redirect to `/login`

## 🐛 Troubleshooting

### "Login failed" error
- Check that `DEMO_MODE = true` in `src/config/demo.js`
- Clear browser cache and localStorage
- Restart dev server

### Redirects to login after successful login
- Check Redux DevTools - user should be in state
- Check localStorage - token should be present
- Check browser console for errors

### Form validation errors
- Demo mode still validates forms
- Use valid email format: `user@example.com`
- Password must be at least 8 characters

## 📊 Monitoring Demo Mode

### Redux DevTools
1. Install Redux DevTools browser extension
2. Open DevTools → Redux tab
3. Watch actions:
   - `auth/loginStart`
   - `auth/loginSuccess`
   - User data in state

### Browser Console
Look for:
```
Login successful! (Demo Mode)
Registration successful! (Demo Mode)
```

## 🔄 Switching Between Modes

### Enable Demo Mode
```javascript
// src/config/demo.js
export const DEMO_MODE = true;
```

### Disable Demo Mode
```javascript
// src/config/demo.js
export const DEMO_MODE = false;
```

**Note:** Restart dev server after changing!

## 📱 Responsive Design

Demo mode works on all screen sizes:
- ✅ Desktop (1920px+)
- ✅ Laptop (1280px)
- ✅ Tablet (768px)
- ✅ Mobile (375px)

Test by resizing your browser window!

## 🎨 UI Improvements Made

### Authentication Pages
- ✅ Fully responsive on all screen sizes
- ✅ Forms enclosed in proper containers
- ✅ Demo mode indicator badge
- ✅ Proper padding and spacing
- ✅ Mobile-friendly layout

### Dashboard
- ✅ Responsive sidebar (collapses on mobile)
- ✅ Responsive header (hides search on mobile)
- ✅ Flexible grid layouts
- ✅ Touch-friendly buttons

## 🚀 Next Steps

1. **Test the UI** - Login and explore all pages
2. **Check Responsiveness** - Resize browser window
3. **Review Code** - See how demo mode works
4. **Build Backend** - When ready, disable demo mode
5. **Connect API** - Update .env and config

## 💡 Tips

- Use realistic test data for better testing
- Test on different screen sizes
- Check Redux state to understand data flow
- Review network tab (no requests in demo mode)
- Use browser DevTools for debugging

---

**Enjoy exploring Spark AI Assistant! 🎉**
