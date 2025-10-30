# Railway Deployment Guide

## 🚀 Deploy BookIt Travel App to Railway

Railway will automatically detect and deploy both your frontend and backend from a single repository.

## Environment Variables for Railway

### Backend Service Environment Variables

Set these in your Railway backend service:

```
NODE_ENV=production
PORT=$PORT
MONGODB_URI=mongodb+srv://lordgameranurag:987654321Anu@cluster0.lfpl7c7.mongodb.net/Highway_Delite?retryWrites=true&w=majority
JWT_SECRET=bookit_super_secure_jwt_secret_key_2025_railway
CORS_ORIGIN=${{RAILWAY_STATIC_URL}}
```

### Frontend Service Environment Variables

Set these in your Railway frontend service:

```
VITE_API_URL=${{backend.RAILWAY_PRIVATE_DOMAIN}}/api
```

## Step-by-Step Deployment

### 1. Push to GitHub First
```bash
git init
git add .
git commit -m "Initial commit: BookIt Travel App for Railway"
git branch -M main
git remote add origin https://github.com/anuragmishrash/bookit-travel-app.git
git push -u origin main
```

### 2. Deploy Backend to Railway

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your `bookit-travel-app` repository
4. Railway will detect multiple services - choose to deploy the **backend first**
5. Set **Root Directory** to: `server`
6. Add these environment variables:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://lordgameranurag:987654321Anu@cluster0.lfpl7c7.mongodb.net/Highway_Delite?retryWrites=true&w=majority
JWT_SECRET=bookit_super_secure_jwt_secret_key_2025_railway
CORS_ORIGIN=https://bookit-travel-app-production.up.railway.app
```

7. Deploy and note your backend URL (e.g., `https://backend-production-xxxx.up.railway.app`)

### 3. Deploy Frontend to Railway

1. In the same Railway project, click "Add Service"
2. Choose "GitHub Repo" and select the same repository
3. Set **Root Directory** to: `client`
4. Add this environment variable:

```
VITE_API_URL=https://your-backend-url.up.railway.app/api
```

5. Deploy the frontend

### 4. Update CORS Settings

1. Go back to your backend service
2. Update the `CORS_ORIGIN` environment variable with your actual frontend URL
3. Redeploy the backend

### 5. Seed the Database

Once both services are deployed, seed your database:

```bash
curl -X POST https://your-backend-url.up.railway.app/api/admin/seed
```

## Alternative: Single Service Deployment

If you prefer to deploy as a single service, Railway can serve the frontend from the backend:

### Environment Variables for Single Service:
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://lordgameranurag:987654321Anu@cluster0.lfpl7c7.mongodb.net/Highway_Delite?retryWrites=true&w=majority
JWT_SECRET=bookit_super_secure_jwt_secret_key_2025_railway
CORS_ORIGIN=${{RAILWAY_STATIC_URL}}
VITE_API_URL=${{RAILWAY_STATIC_URL}}/api
```

## Railway-Specific Configuration

### Nixpacks Build Configuration
Railway uses Nixpacks which will automatically detect:
- Node.js for both frontend and backend
- Build commands from package.json
- Start commands

### Port Configuration
Railway automatically provides the `$PORT` environment variable, which our server.js already uses:

```javascript
const PORT = process.env.PORT || 5000
```

### Domain Configuration
Railway provides these useful variables:
- `${{RAILWAY_STATIC_URL}}` - Your app's public URL
- `${{RAILWAY_PRIVATE_DOMAIN}}` - Internal service communication
- `$PORT` - The port your app should listen on

## Testing Your Deployment

1. **Backend Health Check**: `https://your-backend-url.up.railway.app/api/health`
2. **Frontend**: `https://your-frontend-url.up.railway.app`
3. **Complete Booking Flow**: Test the entire user journey

## Troubleshooting

### Common Issues:
1. **Build Failures**: Check Railway build logs
2. **CORS Errors**: Ensure CORS_ORIGIN matches frontend URL exactly
3. **Database Connection**: Verify MongoDB URI and IP whitelist
4. **Environment Variables**: Double-check all variables are set correctly

### Railway Logs:
- View real-time logs in Railway dashboard
- Use `railway logs` CLI command
- Check both build and runtime logs

## Cost Optimization

Railway offers:
- **Free Tier**: $5 credit monthly (perfect for this project)
- **Pro Plan**: $20/month for production apps
- **Usage-based pricing**: Pay only for what you use

## Benefits of Railway

✅ **Automatic HTTPS**
✅ **Custom domains**
✅ **Zero-config deployments**
✅ **Built-in monitoring**
✅ **Easy scaling**
✅ **GitHub integration**
✅ **Environment variable management**

Your BookIt Travel App will be live and fully functional on Railway! 🚀