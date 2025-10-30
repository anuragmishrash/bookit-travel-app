import mongoose from 'mongoose'

const customerInfoSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [2, 'Full name must be at least 2 characters'],
    maxlength: [100, 'Full name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
      },
      message: 'Please provide a valid email address'
    }
  }
})

const bookingDetailsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, 'Booking date is required'],
    validate: {
      validator: function(v) {
        return v >= new Date().setHours(0, 0, 0, 0)
      },
      message: 'Booking date cannot be in the past'
    }
  },
  time: {
    type: String,
    required: [true, 'Booking time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9] (am|pm)$/, 'Time must be in format HH:MM am/pm']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1'],
    max: [20, 'Quantity cannot exceed 20']
  }
})

const pricingSchema = new mongoose.Schema({
  subtotal: {
    type: Number,
    required: [true, 'Subtotal is required'],
    min: [0, 'Subtotal cannot be negative']
  },
  taxes: {
    type: Number,
    required: [true, 'Taxes amount is required'],
    min: [0, 'Taxes cannot be negative']
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative']
  },
  promoCode: {
    type: String,
    trim: true,
    uppercase: true
  },
  total: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total cannot be negative']
  }
})

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unique: true,
    required: false  // Will be generated automatically
  },
  experienceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Experience',
    required: [true, 'Experience ID is required']
  },
  customerInfo: {
    type: customerInfoSchema,
    required: [true, 'Customer information is required']
  },
  bookingDetails: {
    type: bookingDetailsSchema,
    required: [true, 'Booking details are required']
  },
  pricing: {
    type: pricingSchema,
    required: [true, 'Pricing information is required']
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'confirmed', 'cancelled', 'completed'],
      message: 'Status must be one of: pending, confirmed, cancelled, completed'
    },
    default: 'confirmed'
  },
  paymentStatus: {
    type: String,
    enum: {
      values: ['pending', 'paid', 'failed', 'refunded'],
      message: 'Payment status must be one of: pending, paid, failed, refunded'
    },
    default: 'paid'
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Generate unique booking ID before saving
bookingSchema.pre('save', function(next) {
  if (!this.bookingId) {
    this.bookingId = generateBookingId()
  }
  next()
})

// Virtual to populate experience details
bookingSchema.virtual('experience', {
  ref: 'Experience',
  localField: 'experienceId',
  foreignField: '_id',
  justOne: true
})

// Method to calculate total price
bookingSchema.methods.calculateTotal = function() {
  return this.pricing.subtotal + this.pricing.taxes - this.pricing.discount
}

// Method to format booking for display
bookingSchema.methods.toDisplayFormat = function() {
  return {
    bookingId: this.bookingId,
    experienceName: this.experience?.title || 'Unknown Experience',
    customerName: this.customerInfo.fullName,
    date: this.bookingDetails.date.toLocaleDateString(),
    time: this.bookingDetails.time,
    quantity: this.bookingDetails.quantity,
    total: this.pricing.total,
    status: this.status,
    createdAt: this.createdAt
  }
}

// Static method to find bookings by customer email
bookingSchema.statics.findByCustomerEmail = function(email) {
  return this.find({ 'customerInfo.email': email.toLowerCase() })
    .populate('experienceId', 'title location image')
    .sort({ createdAt: -1 })
}

// Static method to find bookings for a specific experience and date
bookingSchema.statics.findByExperienceAndDate = function(experienceId, date) {
  const startDate = new Date(date)
  startDate.setHours(0, 0, 0, 0)
  
  const endDate = new Date(date)
  endDate.setHours(23, 59, 59, 999)
  
  return this.find({
    experienceId,
    'bookingDetails.date': {
      $gte: startDate,
      $lte: endDate
    },
    status: { $in: ['confirmed', 'completed'] }
  })
}

// Index for better query performance
bookingSchema.index({ bookingId: 1 })
bookingSchema.index({ experienceId: 1, 'bookingDetails.date': 1 })
bookingSchema.index({ 'customerInfo.email': 1 })
bookingSchema.index({ status: 1 })
bookingSchema.index({ createdAt: -1 })

// Function to generate unique booking ID (format: HUF56SO8)
function generateBookingId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  
  let result = ''
  
  // Generate 8 random characters (letters and numbers only for URL safety)
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return result
}

const Booking = mongoose.model('Booking', bookingSchema)

export default Booking