import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Experience from '../models/Experience.js'
import PromoCode from '../models/PromoCode.js'

// Load environment variables
dotenv.config()

// Helper function to generate future dates
const generateFutureSlots = (timeSlots) => {
  const slots = []
  const today = new Date()
  
  console.log(`📅 Generating slots starting from: ${today.toDateString()}`)
  
  // Generate slots for next 30 days
  for (let i = 1; i <= 30; i++) {
    const futureDate = new Date(today)
    futureDate.setDate(today.getDate() + i)
    
    slots.push({
      date: futureDate,
      times: timeSlots.map(slot => ({ ...slot }))
    })
  }
  
  console.log(`📅 Generated ${slots.length} days of slots`)
  return slots
}

// Sample experience data matching Figma designs
const experiencesData = [
  {
    title: 'Kayaking',
    description: 'Curated small-group experience. Certified guide. Safety first with gear included. Helmet and Life jackets along with an expert will accompany in kayaking.',
    location: 'Udupi',
    price: 999,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    category: 'water-sports',
    duration: '3 hours',
    minAge: 10,
    maxGroupSize: 8,
    includes: [
      'Safety equipment (helmet, life jacket)',
      'Professional guide',
      'Basic kayaking training',
      'Scenic route guidance',
      'Safety briefing'
    ],
    availableSlots: generateFutureSlots([
      { time: '07:00 am', available: false, maxCapacity: 8, currentBookings: 8 },
      { time: '09:00 am', available: false, maxCapacity: 8, currentBookings: 8 },
      { time: '11:00 am', available: true, maxCapacity: 8, currentBookings: 3 },
      { time: '01:00 pm', available: false, maxCapacity: 8, currentBookings: 8 }
    ]),
    rating: 4.8,
    reviewCount: 124
  },
  {
    title: 'Nandi Hills Sunrise',
    description: 'Curated small-group experience. Certified guide. Safety first with gear included. Experience the breathtaking sunrise from Nandi Hills with professional photography.',
    location: 'Bangalore',
    price: 899,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    category: 'nature',
    duration: '4 hours',
    minAge: 8,
    maxGroupSize: 12,
    includes: [
      'Transportation from meeting point',
      'Professional guide',
      'Sunrise photography session',
      'Light refreshments',
      'Entry tickets'
    ],
    availableSlots: generateFutureSlots([
      { time: '04:30 am', available: true, maxCapacity: 12, currentBookings: 5 },
      { time: '05:00 am', available: true, maxCapacity: 12, currentBookings: 3 }
    ]),
    rating: 4.9,
    reviewCount: 89
  },
  {
    title: 'Coffee Trail',
    description: 'Curated small-group experience. Certified guide. Safety first with gear included. Explore coffee plantations and learn about the coffee-making process.',
    location: 'Coorg',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    category: 'cultural',
    duration: '5 hours',
    minAge: 12,
    maxGroupSize: 10,
    includes: [
      'Coffee plantation tour',
      'Coffee tasting session',
      'Traditional lunch',
      'Expert guide',
      'Transportation'
    ],
    availableSlots: generateFutureSlots([
      { time: '09:00 am', available: true, maxCapacity: 10, currentBookings: 2 },
      { time: '02:00 pm', available: true, maxCapacity: 10, currentBookings: 1 }
    ]),
    rating: 4.7,
    reviewCount: 156
  },
  {
    title: 'Boat Cruise',
    description: 'Curated small-group experience. Certified guide. Safety first with gear included. Enjoy a scenic boat cruise with stunning views and refreshments.',
    location: 'Sunderbans',
    price: 999,
    image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    category: 'water-sports',
    duration: '2.5 hours',
    minAge: 6,
    maxGroupSize: 15,
    includes: [
      'Boat cruise',
      'Life jackets',
      'Refreshments',
      'Professional crew',
      'Safety briefing'
    ],
    availableSlots: generateFutureSlots([
      { time: '10:00 am', available: true, maxCapacity: 15, currentBookings: 8 },
      { time: '02:00 pm', available: true, maxCapacity: 15, currentBookings: 5 },
      { time: '04:00 pm', available: true, maxCapacity: 15, currentBookings: 3 }
    ]),
    rating: 4.6,
    reviewCount: 203
  },
  {
    title: 'Bunjee Jumping',
    description: 'Curated small-group experience. Certified guide. Safety first with gear included. Experience the ultimate adrenaline rush with professional bungee jumping.',
    location: 'Manali',
    price: 999,
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    category: 'adventure',
    duration: '1 hour',
    minAge: 18,
    maxGroupSize: 6,
    includes: [
      'Professional equipment',
      'Safety harness',
      'Certified instructor',
      'Video recording',
      'Certificate'
    ],
    availableSlots: generateFutureSlots([
      { time: '10:00 am', available: true, maxCapacity: 6, currentBookings: 2 },
      { time: '12:00 pm', available: true, maxCapacity: 6, currentBookings: 1 },
      { time: '02:00 pm', available: true, maxCapacity: 6, currentBookings: 0 },
      { time: '04:00 pm', available: true, maxCapacity: 6, currentBookings: 3 }
    ]),
    rating: 4.9,
    reviewCount: 67
  }
]

// Sample promo codes
const promoCodesData = [
  {
    code: 'SAVE10',
    description: '10% discount on all bookings',
    discountType: 'percentage',
    discountValue: 10,
    isActive: true,
    expiryDate: new Date('2025-12-31'),
    usageLimit: 1000,
    usedCount: 0,
    minOrderAmount: 500,
    maxDiscountAmount: 200
  },
  {
    code: 'FLAT100',
    description: 'Flat ₹100 off on bookings above ₹800',
    discountType: 'fixed',
    discountValue: 100,
    isActive: true,
    expiryDate: new Date('2025-12-31'),
    usageLimit: 500,
    usedCount: 0,
    minOrderAmount: 800,
    maxDiscountAmount: null
  },
  {
    code: 'WELCOME20',
    description: '20% off for first-time users',
    discountType: 'percentage',
    discountValue: 20,
    isActive: true,
    expiryDate: new Date('2025-12-31'),
    usageLimit: null,
    usedCount: 0,
    minOrderAmount: 1000,
    maxDiscountAmount: 500,
    firstTimeUserOnly: true
  }
]

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log('✅ Connected to MongoDB')

    // Clear existing data
    console.log('🧹 Clearing existing data...')
    await Experience.deleteMany({})
    await PromoCode.deleteMany({})

    // Seed experiences
    console.log('🌱 Seeding experiences...')
    const experiences = await Experience.insertMany(experiencesData)
    console.log(`✅ Created ${experiences.length} experiences`)

    // Seed promo codes
    console.log('🌱 Seeding promo codes...')
    const promoCodes = await PromoCode.insertMany(promoCodesData)
    console.log(`✅ Created ${promoCodes.length} promo codes`)

    console.log('🎉 Database seeded successfully!')
    
    // Display summary with date info
    console.log('\n📊 Seeded Data Summary:')
    console.log('Experiences:')
    experiences.forEach(exp => {
      const firstDate = exp.availableSlots?.[0]?.date
      const lastDate = exp.availableSlots?.[exp.availableSlots.length - 1]?.date
      console.log(`  - ${exp.title} (${exp.location}) - ₹${exp.price}`)
      if (firstDate && lastDate) {
        console.log(`    Dates: ${new Date(firstDate).toDateString()} to ${new Date(lastDate).toDateString()}`)
      }
    })
    
    console.log('\nPromo Codes:')
    promoCodes.forEach(promo => {
      console.log(`  - ${promo.code}: ${promo.description}`)
    })

  } catch (error) {
    console.error('❌ Error seeding database:', error)
  } finally {
    // Close connection
    await mongoose.connection.close()
    console.log('🔒 Database connection closed')
    process.exit(0)
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
}

export default seedDatabase