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
  
  // Generate slots for next 4 days
  for (let i = 1; i <= 4; i++) {
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

// Experience data matching EXACT Figma design layout
const experiencesData = [
  // TOP ROW - Position 1: Kayaking (Udupi) - ₹999
  {
    title: 'Kayaking',
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    location: 'Udupi',
    price: 999,
    image: '/images/Kayaking.jpg',
    category: 'water-sports',
    duration: '3 hours',
    minAge: 10,
    maxGroupSize: 8,
    displayOrder: 1,
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
  // TOP ROW - Position 2: Nandi Hills Sunrise (Bangalore) - ₹899
  {
    title: 'Nandi Hills Sunrise',
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    location: 'Bangalore',
    price: 899,
    image: '/images/Nandi Hills Sunrise.jpg',
    category: 'nature',
    duration: '4 hours',
    minAge: 8,
    maxGroupSize: 12,
    displayOrder: 2,
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
  // TOP ROW - Position 3: Coffee Trail (Coorg) - ₹1299
  {
    title: 'Coffee Trail',
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    location: 'Coorg',
    price: 1299,
    image: '/images/Coffee Trail.jpg',
    category: 'cultural',
    duration: '5 hours',
    minAge: 12,
    maxGroupSize: 10,
    displayOrder: 3,
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
  // TOP ROW - Position 4: Kayaking (Udupi, Karnataka) - ₹999
  {
    title: 'Kayaking',
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    location: 'Udupi, Karnataka',
    price: 999,
    image: '/images/Kayaking 2.jpg',
    category: 'water-sports',
    duration: '3 hours',
    minAge: 10,
    maxGroupSize: 8,
    displayOrder: 4,
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
  // BOTTOM ROW - Position 5: Nandi Hills Sunrise (Bangalore) - ₹899
  {
    title: 'Nandi Hills Sunrise',
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    location: 'Bangalore',
    price: 899,
    image: '/images/Nandi Hills Sunrise 2.jpg',
    category: 'nature',
    duration: '4 hours',
    minAge: 8,
    maxGroupSize: 12,
    displayOrder: 5,
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
  // BOTTOM ROW - Position 6: Boat Cruise (Sunderban) - ₹999
  {
    title: 'Boat Cruise',
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    location: 'Sunderban',
    price: 999,
    image: '/images/Boat Cruise .jpg',
    category: 'water-sports',
    duration: '2.5 hours',
    minAge: 6,
    maxGroupSize: 15,
    displayOrder: 6,
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
  // BOTTOM ROW - Position 7: Bunjee Jumping (Manali) - ₹999
  {
    title: 'Bunjee Jumping',
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    location: 'Manali',
    price: 999,
    image: '/images/Bunjee Jumping.jpg',
    category: 'adventure',
    duration: '1 hour',
    minAge: 18,
    maxGroupSize: 6,
    displayOrder: 7,
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
  },
  // BOTTOM ROW - Position 8: Coffee Trail (Coorg) - ₹1299
  {
    title: 'Coffee Trail',
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    location: 'Coorg',
    price: 1299,
    image: '/images/Coffee Trail 2.jpg',
    category: 'cultural',
    duration: '5 hours',
    minAge: 12,
    maxGroupSize: 10,
    displayOrder: 8,
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