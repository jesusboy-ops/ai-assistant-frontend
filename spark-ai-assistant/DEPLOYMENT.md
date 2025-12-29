# Spark AI Assistant - Vercel Deployment Guide

## 🚀 Quick Deploy to Vercel

### Prerequisites
- Vercel account (free at [vercel.com](https://vercel.com))
- GitHub repository with your code
- Google Gemini API key

### 1. Deploy via Vercel Dashboard

1. **Connect Repository**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Environment Variables**
   Add these environment variables in Vercel dashboard:
   ```
   VITE_GEMINI_API_KEY=AIzaSyCeaD6_wrNv_Wj4K8XZZKrvZqaK1kxUXrY
   VITE_AI_MODEL=gemini-1.5-flash
   VITE_API_BASE_URL=
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
   ```

3. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your app

### 2. Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
cd spark-ai-assistant
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name: spark-ai-assistant
# - Directory: ./
# - Override settings? N
```

### 3. Environment Variables Setup

After deployment, add environment variables:

```bash
# Set environment variables
vercel env add VITE_GEMINI_API_KEY
# Enter: AIzaSyCeaD6_wrNv_Wj4K8XZZKrvZqaK1kxUXrY

vercel env add VITE_AI_MODEL
# Enter: gemini-1.5-flash

vercel env add VITE_API_BASE_URL
# Enter: (leave empty)

vercel env add VITE_GOOGLE_CLIENT_ID
# Enter: your_google_client_id_here

# Redeploy with new environment variables
vercel --prod
```

## 🔧 Configuration Files

### vercel.json
- Configures routing for SPA
- Sets up environment variables
- Adds security headers
- Optimizes caching

### .vercelignore
- Excludes unnecessary files from deployment
- Reduces deployment size and time

### vite.config.js
- Optimized for production builds
- Code splitting for better performance
- Chunk size optimization

## 📊 Performance Optimizations

### Code Splitting
- Vendor libraries separated into chunks
- MUI components in separate chunk
- Redux toolkit in separate chunk
- React Router in separate chunk

### Build Optimizations
- Minification with Terser
- Source maps disabled for production
- Chunk size warnings at 1MB

### Caching Strategy
- Static assets cached for 1 year
- HTML files not cached (for updates)
- Security headers applied

## 🌐 Custom Domain (Optional)

1. **Add Domain in Vercel**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. **SSL Certificate**
   - Automatically provisioned by Vercel
   - No additional configuration needed

## 🔍 Monitoring & Analytics

### Vercel Analytics
```bash
# Install Vercel Analytics (optional)
npm install @vercel/analytics

# Add to main.jsx
import { Analytics } from '@vercel/analytics/react'

// Add <Analytics /> component
```

### Performance Monitoring
- Vercel provides built-in performance monitoring
- Core Web Vitals tracking
- Real User Monitoring (RUM)

## 🐛 Troubleshooting

### Build Failures
```bash
# Check build locally
npm run build

# Preview build locally
npm run preview
```

### Environment Variables
- Ensure all VITE_ prefixed variables are set
- Check variable names match exactly
- Redeploy after adding variables

### Routing Issues
- vercel.json handles SPA routing
- All routes redirect to index.html
- React Router handles client-side routing

### API Issues
- CORS handled by backend configuration
- No proxy needed in production
- Direct API calls to backend URLs

## 📱 Mobile Optimization

- Responsive design implemented
- Touch-friendly interface
- Optimized for all screen sizes
- Progressive Web App ready

## 🔐 Security Features

- Content Security Policy headers
- XSS protection
- Frame options configured
- Referrer policy set
- HTTPS enforced by Vercel

## 📈 Scaling

- Vercel automatically scales
- Edge network distribution
- Global CDN for static assets
- Serverless functions support

---

## 🎉 Your Spark AI Assistant is now live!

After deployment, your app will be available at:
- `https://your-project-name.vercel.app`
- Custom domain (if configured)

The app includes:
- ✅ Real-time AI chat with Google Gemini
- ✅ Professional email generation
- ✅ Calendar and event management
- ✅ Notes and file management
- ✅ Responsive design for all devices
- ✅ Dark neon theme
- ✅ Secure authentication system