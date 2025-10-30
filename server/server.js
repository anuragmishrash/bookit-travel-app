import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './utils/database.js'
import experienceRoutes from './routes/experiences.js'
import bookingRoutes from './routes/bookings.js'
import promoRoutes from './routes/promo.js'
import adminRoutes from './routes/admin.js'
import errorHandler from './middleware/errorHandler.js'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Connect to MongoDB
connectDB()

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/experiences', experienceRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/promo', promoRoutes)
app.use('/api/admin', adminRoutes)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'BookIt API is running successfully',
    timestamp: new Date().toISOString()
  })
})

// Error handling middleware
app.use(errorHandler)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Route not found',
      code: 'ROUTE_NOT_FOUND'
    }
  })
})

app.listen(PORT, () => {
  console.log(`🚀 BookIt server running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`)
})