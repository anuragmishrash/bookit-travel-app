# Railway + Vercel Deployment Guide

## 🚂 Backend on Railway + ⚡ Frontend on Vercel

This is an excellent combination:
- **Railway**: Perfect for Node.js backend with database
- **Vercel**: Optimized for React frontend with global CDN

## Environment Variables

### 🚂 Railway Backend Environment Variables

Set these in your Railway backend service:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://lordgameranurag:987654321Anu@cluster0.lfpl7c7.mongodb.net/Highway_Delite?retryWrites=true&w=majority
JWT_SECRET=bookit_super_secure_jwt_secret_key_2025_railway
CORS_ORIGIN=https://bookit-travel-app.vercel.app
```

### ⚡ Vercel Frontend Environment Variables

Set these in your Vercel project settings:

```
VITE_API_URL=https://your-backend-name.up.railway.app/api
```

## Step-by-Step Deployment

### Step 1: Deploy Backend to Railway

1. **Push to GitHub** (if not done already):
   ```bash
   git init
   git add .
   git commit -m "BookIt Travel App - Railway Backend + Vercel Frontend"
   git branch -M main
   git remote add origin https://github.com/anuragmishrash/bookit-travel-app.git
   git push -u origin main
   ```

2. **Go to Railway**:
   - Visit [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your `bookit-travel-app` repository

3. **Configure Backend Service**:
   - Set **Root Directory**: `server`
   - Add environment variables:
     ```
     NODE_ENV=production
     MONGODB_URI=mongodb+srv://lordgameranurag:987654321Anu@cluster0.lfpl7c7.mongodb.net/Highway_Delite?retryWrites=true&w=majority
     JWT_SECRET=bookit_super_secure_jwt_secret_key_2025_railway
     CORS_ORIGIN=https://bookit-travel-app.vercel.app
     ```

4. **Deploy and Note URL**:
   - Railway will give you a URL like: `https://bookit-backend-production-xxxx.up.railway.app`
   - **Save this URL** - you'll need it for Vercel!

### Step 2: Deploy Frontend to Vercel

1. **Go to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Frontend**:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

3. **Add Environment Variable**:
   ```
   VITE_API_URL=https://your-railway-backend-url.up.railway.app/api
   ```
   Replace `your-railway-backend-url` with your actual Railway URL from Step 1

4. **Deploy**:
   - Vercel will give you a URL like: `https://bookit-travel-app.vercel.app`

### Step 3: Update CORS Settings

1. **Go back to Railway**
2. **Update CORS_ORIGIN** with your actual Vercel URL:
   ```
   CORS_ORIGIN=https://bookit-travel-app.vercel.app
   ```
3. **Redeploy** the backend service

### Step 4: Seed the Database

```bash
curl -X POST https://your-railway-backend-url.up.railway.app/api/admin/seed
```

## Example URLs After Deployment

### Your Final URLs Will Look Like:
- **Frontend**: `https://bookit-travel-app.vercel.app`
- **Backend**: `https://bookit-backend-production-abc123.up.railway.app`
- **API Health**: `https://bookit-backend-production-abc123.up.railway.app/api/health`

## Final Environment Variables (Real Example)

### Railway Backend:
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://lordgameranurag:987654321Anu@cluster0.lfpl7c7.mongodb.net/Highway_Delite?retryWrites=true&w=majority
JWT_SECRET=bookit_super_secure_jwt_secret_key_2025_railway
CORS_ORIGIN=https://bookit-travel-app.vercel.app
```

### Vercel Frontend:
```
VITE_API_URL=https://bookit-backend-production-abc123.up.railway.app/api
```

## Benefits of This Setup

### 🚂 Railway Backend:
✅ **Perfect for Node.js + MongoDB**
✅ **Built-in environment variables**
✅ **Automatic deployments**
✅ **Free $5/month credit**
✅ **Easy database connections**

### ⚡ Vercel Frontend:
✅ **Optimized for React/Vite**
✅ **Global CDN (super fast)**
✅ **Automatic HTTPS**
✅ **Perfect for static sites**
✅ **Excellent developer experience**

## Testing Your Deployment

1. **Backend Health**: Visit `https://your-railway-url.up.railway.app/api/health`
2. **Frontend**: Visit `https://your-vercel-url.vercel.app`
3. **Full Flow**: Test booking from frontend to backend
4. **CORS**: Ensure no CORS errors in browser console

## Troubleshooting

### Common Issues:
1. **CORS Errors**: Double-check CORS_ORIGIN matches Vercel URL exactly
2. **API Not Found**: Verify VITE_API_URL points to Railway backend
3. **Build Failures**: Check build logs in respective platforms
4. **Database Connection**: Ensure MongoDB URI is correct

### Quick Fixes:
- **CORS Issues**: Use `CORS_ORIGIN=*` temporarily for testing
- **API Issues**: Test backend directly: `https://railway-url/api/health`
- **Build Issues**: Check Node.js version compatibility

## Cost Breakdown

### Railway (Backend):
- **Free Tier**: $5 credit/month
- **Usage**: ~$3-5/month for this app

### Vercel (Frontend):
- **Hobby Plan**: Free
- **Pro Plan**: $20/month (if needed)

**Total Cost**: ~$0-5/month for hobby use! 💰

Your BookIt Travel App will be blazing fast with this setup! 🚀