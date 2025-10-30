import express from 'express'
import seedDatabase from '../utils/seedDatabase.js'

const router = express.Router()

// @desc    Seed database with sample data
// @route   POST /api/admin/seed
// @access  Public (in production, this should be protected)
router.post('/seed', async (req, res) => {
  try {
    console.log('🌱 Starting database seeding...')
    
    // Clear existing data first
    const Experience = (await import('../models/Experience.js')).default
    const PromoCode = (await import('../models/PromoCode.js')).default
    
    await Experience.deleteMany({})
    await PromoCode.deleteMany({})
    console.log('🧹 Cleared existing data')
    
    // Run seeding
    await seedDatabase()
    
    res.status(200).json({
      success: true,
      message: 'Database seeded successfully with current dates'
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

// @desc    Clear and reseed database with current dates
// @route   POST /api/admin/reseed
// @access  Public
router.post('/reseed', async (req, res) => {
  try {
    const today = new Date()
    console.log(`🔄 Reseeding database with fresh dates starting from: ${today.toDateString()}`)
    
    const Experience = (await import('../models/Experience.js')).default
    const PromoCode = (await import('../models/PromoCode.js')).default
    
    // Clear all data
    console.log('🧹 Clearing existing experiences and promo codes...')
    await Experience.deleteMany({})
    await PromoCode.deleteMany({})
    
    // Reseed with current dates
    console.log('🌱 Creating new data with current dates...')
    await seedDatabase()
    
    // Verify the dates were created correctly
    const sampleExperience = await Experience.findOne()
    const firstSlotDate = sampleExperience?.availableSlots?.[0]?.date
    
    res.status(200).json({
      success: true,
      message: `Database reseeded successfully with dates starting from ${today.toDateString()}`,
      sampleDate: firstSlotDate ? new Date(firstSlotDate).toDateString() : 'No dates found'
    })
  } catch (error) {
    console.error('❌ Reseeding failed:', error)
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to reseed database',
        details: error.message
      }
    })
  }
})

export default router