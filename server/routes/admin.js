import express from 'express'
import seedDatabase from '../utils/seedDatabase.js'

const router = express.Router()

// @desc    Seed database with sample data
// @route   POST /api/admin/seed
// @access  Public (in production, this should be protected)
router.post('/seed', async (req, res) => {
  try {
    console.log('🌱 Starting database seeding...')
    await seedDatabase()
    
    res.status(200).json({
      success: true,
      message: 'Database seeded successfully with sample data'
    })
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to seed database',
        details: error.message
      }
    })
  }
})

export default router