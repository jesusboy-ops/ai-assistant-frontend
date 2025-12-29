# Spark AI Assistant - Quick Reference

## 🚀 Quick Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 📍 Current Status

**Development Server:** http://localhost:5174
**Status:** ✅ Running and ready to use!

## 📂 Key Files

| File | Purpose |
|------|---------|
| `src/App.jsx` | Main app component with routing |
| `src/main.jsx` | Application entry point |
| `src/theme.js` | MUI theme configuration |
| `src/store/store.js` | Redux store configuration |
| `.env` | Environment variables |

## 🎨 Color Palette

```css
/* Primary Gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Secondary Gradient */
background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);

/* Dark Background */
background: #1A202C;

/* Card Background */
background: #2D3748;

/* Sidebar */
background: #1e293b;

/* Cyan Accent */
color: #06b6d4;
```

## 🗺️ Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/login` | Login | User login page |
| `/signup` | Signup | User registration |
| `/forgot-password` | ForgotPassword | Password reset request |
| `/reset-password` | ResetPassword | Password reset form |
| `/dashboard` | Dashboard | Main dashboard |
| `/chat` | Chat | AI chat interface |
| `/emails` | Emails | Email generator |
| `/notes` | Notes | Notes management |
| `/calendar` | Calendar | Calendar view |
| `/files` | Files | File manager |
| `/settings` | Settings | User settings |

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/oauth/google`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

### Chat
- `GET /api/chat/conversations`
- `GET /api/chat/conversations/:id`
- `POST /api/chat/message`
- `DELETE /api/chat/conversations/:id`

### Email
- `POST /api/email/generate`
- `POST /api/email/send`
- `POST /api/email/generate-and-send`

### Notes
- `GET /api/notes`
- `POST /api/notes`
- `PUT /api/notes/:id`
- `DELETE /api/notes/:id`

### Calendar
- `GET /api/calendar/events`
- `POST /api/calendar/events`
- `PUT /api/calendar/events/:id`
- `DELETE /api/calendar/events/:id`

### Files
- `POST /api/upload`
- `GET /api/upload/files`
- `DELETE /api/upload/files/:id`

## 🔧 Redux Slices

| Slice | State | Actions |
|-------|-------|---------|
| `auth` | User, token, isAuthenticated | login, logout, updateUser |
| `chat` | Conversations, messages | setConversations, addMessage |
| `email` | Generated emails, history | setGeneratedEmail, addToHistory |
| `notes` | Notes array | addNote, updateNote, deleteNote |
| `calendar` | Events, view, selectedDate | addEvent, updateEvent, deleteEvent |
| `files` | Files array, uploadProgress | addFile, deleteFile |
| `notifications` | Notifications, unreadCount | addNotification, markAsRead |

## 🎯 Common Tasks

### Add a New Page
1. Create component in `src/pages/`
2. Add route in `src/App.jsx`
3. Add navigation item in `src/layouts/Sidebar.jsx`

### Add a New API Endpoint
1. Add function in appropriate `src/api/*Api.js` file
2. Use in component or custom hook

### Add a New Redux Slice
1. Create slice in `src/store/slices/`
2. Import and add to `src/store/store.js`
3. Use with `useSelector` and `useDispatch`

### Style a Component
```jsx
// Using sx prop
<Box sx={{ 
  padding: 2, 
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
}}>
  Content
</Box>

// Using theme
import { useTheme } from '@mui/material/styles';
const theme = useTheme();
```

## 🐛 Debugging

### Redux State
1. Install Redux DevTools extension
2. Open browser DevTools
3. Go to Redux tab
4. Inspect state and actions

### API Calls
1. Open browser DevTools
2. Go to Network tab
3. Filter by XHR/Fetch
4. Check request/response

### React Components
1. Install React Developer Tools
2. Open browser DevTools
3. Go to Components tab
4. Inspect props and state

## 📦 Key Dependencies

```json
{
  "react": "^18.3.1",
  "@mui/material": "latest",
  "@reduxjs/toolkit": "latest",
  "react-router-dom": "latest",
  "axios": "latest",
  "date-fns": "latest"
}
```

## 🔐 Environment Variables

```env
# Required
VITE_API_BASE_URL=http://localhost:3000

# Optional
VITE_GOOGLE_CLIENT_ID=your_client_id
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

## 📱 Responsive Breakpoints

```javascript
// MUI breakpoints
xs: 0px      // Extra small (mobile)
sm: 600px    // Small (tablet)
md: 900px    // Medium (small laptop)
lg: 1200px   // Large (desktop)
xl: 1536px   // Extra large (large desktop)
```

## 🎨 Common MUI Components

```jsx
// Button with gradient
<Button
  variant="contained"
  sx={{
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  }}
>
  Click Me
</Button>

// Card
<Card>
  <CardContent>
    Content here
  </CardContent>
</Card>

// Grid
<Grid container spacing={3}>
  <Grid item xs={12} md={6}>
    Column 1
  </Grid>
  <Grid item xs={12} md={6}>
    Column 2
  </Grid>
</Grid>

// Dialog
<Dialog open={open} onClose={handleClose}>
  <DialogTitle>Title</DialogTitle>
  <DialogContent>Content</DialogContent>
  <DialogActions>
    <Button onClick={handleClose}>Close</Button>
  </DialogActions>
</Dialog>
```

## 🔄 State Management Patterns

### Using Redux
```jsx
import { useSelector, useDispatch } from 'react-redux';
import { someAction } from '../store/slices/someSlice';

function Component() {
  const data = useSelector((state) => state.someSlice.data);
  const dispatch = useDispatch();
  
  const handleClick = () => {
    dispatch(someAction(payload));
  };
}
```

### Using Custom Hooks
```jsx
import useAuth from '../hooks/useAuth';

function Component() {
  const { user, login, logout } = useAuth();
  
  const handleLogin = async () => {
    await login(email, password);
  };
}
```

## 🚨 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Port in use | Vite will auto-select next port |
| Module not found | Run `npm install` |
| API not connecting | Check `VITE_API_BASE_URL` in `.env` |
| CORS error | Configure backend CORS |
| 404 on refresh | Configure server redirects |
| Build fails | Delete `node_modules`, run `npm install` |

## 📚 Documentation Files

- `README.md` - Main documentation
- `SETUP.md` - Setup guide
- `API_SPEC.md` - Backend API specification
- `PROJECT_SUMMARY.md` - Project overview
- `DEPLOYMENT.md` - Deployment guide
- `QUICK_REFERENCE.md` - This file

## 🎓 Learning Resources

- [React Docs](https://react.dev)
- [Material UI](https://mui.com)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [React Router](https://reactrouter.com)
- [Axios](https://axios-http.com)
- [Vite](https://vitejs.dev)

## 💡 Pro Tips

1. **Use Redux DevTools** for debugging state
2. **Use React DevTools** for component inspection
3. **Check Network tab** for API issues
4. **Read error messages** carefully
5. **Check console** for warnings
6. **Use TypeScript** for better type safety (future enhancement)
7. **Write tests** for critical functionality
8. **Document your code** with comments
9. **Follow React best practices**
10. **Keep dependencies updated**

## 🎯 Next Steps

1. ✅ Explore the application
2. ⏳ Connect to backend API
3. ⏳ Implement Google OAuth
4. ⏳ Add voice features
5. ⏳ Enhance calendar
6. ⏳ Add rich text editor
7. ⏳ Deploy to production

## 📞 Need Help?

1. Check the documentation files
2. Review code comments
3. Use Redux/React DevTools
4. Check browser console
5. Review API responses

---

**Happy coding! 🚀**
