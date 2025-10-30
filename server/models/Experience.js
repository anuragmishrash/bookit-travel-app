import mongoose from 'mongoose'

const timeSlotSchema = new mongoose.Schema({
  time: {
    type: String,
    required: [true, 'Time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9] (am|pm)$/, 'Time must be in format HH:MM am/pm']
  },
  available: {
    type: Boolean,
    default: true
  },
  maxCapacity: {
    type: Number,
    required: [true, 'Max capacity is required'],
    min: [1, 'Max capacity must be at least 1']
  },
  currentBookings: {
    type: Number,
    default: 0,
    min: [0, 'Current bookings cannot be negative']
  }
})

const availableSlotSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  times: [timeSlotSchema]
})

const experienceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Experience title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  image: {
    type: String,
    required: [true, 'Image URL is required'],
    validate: {
      validator: function (v) {
        // Allow both URLs and local paths
        return /^(https?:\/\/.+|\/images\/.+)$/i.test(v)
      },
      message: 'Image must be a valid URL or local path starting with /images/'
    }
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['adventure', 'nature', 'cultural', 'water-sports', 'hiking', 'sightseeing'],
      message: 'Category must be one of: adventure, nature, cultural, water-sports, hiking, sightseeing'
    }
  },
  duration: {
    type: String,
    required: [true, 'Duration is required'],
    trim: true
  },
  minAge: {
    type: Number,
    required: [true, 'Minimum age is required'],
    min: [0, 'Minimum age cannot be negative'],
    max: [100, 'Minimum age cannot exceed 100']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'Maximum group size is required'],
    min: [1, 'Maximum group size must be at least 1']
  },
  includes: [{
    type: String,
    trim: true
  }],
  availableSlots: [availableSlotSchema],
  isActive: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5'],
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: [0, 'Review count cannot be negative']
  },
  displayOrder: {
    type: Number,
    default: 0,
    min: [0, 'Display order cannot be negative']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Virtual for checking if experience has available slots
experienceSchema.virtual('hasAvailableSlots').get(function () {
  if (!this.availableSlots || !Array.isArray(this.availableSlots)) {
    return false
  }
  return this.availableSlots.some(slot =>
    slot.times && Array.isArray(slot.times) && slot.times.some(time =>
      time.available && time.currentBookings < time.maxCapacity
    )
  )
})

// Method to get available slots for a specific date
experienceSchema.methods.getAvailableSlotsForDate = function (date) {
  const targetDate = new Date(date)
  targetDate.setHours(0, 0, 0, 0)

  const slot = this.availableSlots.find(slot => {
    const slotDate = new Date(slot.date)
    slotDate.setHours(0, 0, 0, 0)
    return slotDate.getTime() === targetDate.getTime()
  })

  if (!slot) return []

  return slot.times.filter(time =>
    time.available && time.currentBookings < time.maxCapacity
  )
}

// Method to book a slot
experienceSchema.methods.bookSlot = function (date, time, quantity = 1) {
  const targetDate = new Date(date)
  targetDate.setHours(0, 0, 0, 0)

  const slotIndex = this.availableSlots.findIndex(slot => {
    const slotDate = new Date(slot.date)
    slotDate.setHours(0, 0, 0, 0)
    return slotDate.getTime() === targetDate.getTime()
  })

  if (slotIndex === -1) {
    throw new Error('Date not available')
  }

  const timeIndex = this.availableSlots[slotIndex].times.findIndex(t => t.time === time)

  if (timeIndex === -1) {
    throw new Error('Time slot not found')
  }

  const timeSlot = this.availableSlots[slotIndex].times[timeIndex]

  if (!timeSlot.available) {
    throw new Error('Time slot is not available')
  }

  if (timeSlot.currentBookings + quantity > timeSlot.maxCapacity) {
    throw new Error('Not enough capacity for this booking')
  }

  this.availableSlots[slotIndex].times[timeIndex].currentBookings += quantity

  // Mark as unavailable if fully booked
  if (this.availableSlots[slotIndex].times[timeIndex].currentBookings >= timeSlot.maxCapacity) {
    this.availableSlots[slotIndex].times[timeIndex].available = false
  }

  return this.save()
}

// Index for better query performance
experienceSchema.index({ category: 1, isActive: 1 })
experienceSchema.index({ location: 1 })
experienceSchema.index({ price: 1 })
experienceSchema.index({ 'availableSlots.date': 1 })

const Experience = mongoose.model('Experience', experienceSchema)

export default Experience