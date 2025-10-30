# Deployment Guide

This guide will help you deploy the BookIt Travel App to production.

## Prerequisites

1. **MongoDB Atlas Account**: Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. **GitHub Account**: For version control and CI/CD
3. **Vercel Account**: For frontend deployment (free tier available)
4. **Render Account**: For backend deployment (free tier available)

## Step-by-Step Deployment

### 1. Prepare MongoDB Atlas

1. Create a new cluster in MongoDB Atlas
2. Create a database user with read/write permissions
3. Whitelist your IP addresses (or use 0.0.0.0/0 for all IPs)
4. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/database`

### 2. Fork and Clone Repository

1. Fork this repository to your GitHub account
2. Clone your fork locally:
   ```bash
   git clone https://github.com/yourusername/bookit-travel-app.git
   cd bookit-travel-app
   ```

### 3. Deploy Backend to Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `bookit-api`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add environment variables:
   ```
   NODE_ENV=production
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secure_random_string
   CORS_ORIGIN=https://your-app-name.vercel.app
   ```
6. Deploy and note your backend URL (e.g., `https://bookit-api.onrender.com`)

### 4. Deploy Frontend to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add environment variables:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```
6. Deploy and note your frontend URL

### 5. Update CORS Settings

1. Go back to your Render backend service
2. Update the `CORS_ORIGIN` environment variable with your actual Vercel URL
3. Redeploy the backend service

### 6. Seed the Database

1. Use the backend API to seed the database:
   ```bash
   curl -X POST https://your-backend-url.onrender.com/api/seed
   ```
   Or run the seed script locally with production MongoDB URI

### 7. Test the Deployment

1. Visit your frontend URL
2. Test the complete booking flow:
   - Browse experiences
   - Select dates and times
   - Complete a booking
   - Verify promo codes work

## Environment Variables Reference

### Backend (.env)
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bookit
JWT_SECRET=your-super-secure-jwt-secret-key-here
CORS_ORIGIN=https://bookit-travel-app.vercel.app
```

### Frontend (.env)
```
VITE_API_URL=https://bookit-api.onrender.com/api
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure `CORS_ORIGIN` matches your frontend URL exactly
2. **Database Connection**: Verify MongoDB URI and IP whitelist settings
3. **Build Failures**: Check Node.js version compatibility (use Node 18+)
4. **API Not Found**: Ensure backend is deployed and `VITE_API_URL` is correct

### Logs and Debugging

- **Render Logs**: Available in Render dashboard under "Logs" tab
- **Vercel Logs**: Available in Vercel dashboard under "Functions" tab
- **MongoDB Logs**: Available in Atlas dashboard under "Database" → "Monitoring"

## Performance Optimization

1. **Enable Gzip**: Render enables this by default
2. **CDN**: Vercel provides global CDN automatically
3. **Database Indexing**: Already configured in the models
4. **Caching**: Consider adding Redis for session management

## Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **JWT Secret**: Use a strong, random secret key
3. **CORS**: Set specific origins, avoid wildcards in production
4. **Rate Limiting**: Consider adding rate limiting middleware
5. **Input Validation**: Already implemented with express-validator

## Monitoring

1. **Uptime Monitoring**: Use services like UptimeRobot
2. **Error Tracking**: Consider Sentry for error monitoring
3. **Analytics**: Add Google Analytics or similar
4. **Performance**: Use Lighthouse for performance audits

## Scaling

1. **Database**: MongoDB Atlas auto-scales
2. **Backend**: Render provides auto-scaling
3. **Frontend**: Vercel handles global distribution
4. **Load Testing**: Use tools like Artillery or k6

## Support

If you encounter issues during deployment:

1. Check the troubleshooting section above
2. Review the logs in your deployment platforms
3. Ensure all environment variables are set correctly
4. Verify your MongoDB connection and permissions

For additional help, create an issue in the GitHub repository with:
- Deployment platform (Render/Vercel)
- Error messages or logs
- Steps you've already tried