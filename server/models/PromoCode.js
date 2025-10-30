import mongoose from 'mongoose'

const promoCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Promo code is required'],
    unique: true,
    trim: true,
    uppercase: true,
    minlength: [3, 'Promo code must be at least 3 characters'],
    maxlength: [20, 'Promo code cannot exceed 20 characters'],
    match: [/^[A-Z0-9]+$/, 'Promo code can only contain uppercase letters and numbers']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  discountType: {
    type: String,
    required: [true, 'Discount type is required'],
    enum: {
      values: ['percentage', 'fixed'],
      message: 'Discount type must be either percentage or fixed'
    }
  },
  discountValue: {
    type: Number,
    required: [true, 'Discount value is required'],
    min: [0, 'Discount value cannot be negative'],
    validate: {
      validator: function(value) {
        if (this.discountType === 'percentage') {
          return value <= 100
        }
        return true
      },
      message: 'Percentage discount cannot exceed 100%'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date,
    required: [true, 'Expiry date is required'],
    validate: {
      validator: function(v) {
        return v > new Date()
      },
      message: 'Expiry date must be in the future'
    }
  },
  usageLimit: {
    type: Number,
    default: null, // null means unlimited
    min: [1, 'Usage limit must be at least 1']
  },
  usedCount: {
    type: Number,
    default: 0,
    min: [0, 'Used count cannot be negative']
  },
  minOrderAmount: {
    type: Number,
    default: 0,
    min: [0, 'Minimum order amount cannot be negative']
  },
  maxDiscountAmount: {
    type: Number,
    default: null, // null means no maximum
    min: [0, 'Maximum discount amount cannot be negative']
  },
  applicableCategories: [{
    type: String,
    enum: ['adventure', 'nature', 'cultural', 'water-sports', 'hiking', 'sightseeing']
  }],
  excludedExperiences: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Experience'
  }],
  firstTimeUserOnly: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Virtual to check if promo code is currently valid
promoCodeSchema.virtual('isCurrentlyValid').get(function() {
  const now = new Date()
  return this.isActive && 
         now >= this.startDate && 
         now <= this.expiryDate &&
         (this.usageLimit === null || this.usedCount < this.usageLimit)
})

// Virtual to get remaining uses
promoCodeSchema.virtual('remainingUses').get(function() {
  if (this.usageLimit === null) return 'Unlimited'
  return Math.max(0, this.usageLimit - this.usedCount)
})

// Method to validate promo code for a specific order
promoCodeSchema.methods.validateForOrder = function(orderAmount, experienceCategory, experienceId, isFirstTimeUser = false) {
  const errors = []
  
  // Check if promo code is active
  if (!this.isActive) {
    errors.push('Promo code is not active')
  }
  
  // Check date validity
  const now = new Date()
  if (now < this.startDate) {
    errors.push('Promo code is not yet valid')
  }
  
  if (now > this.expiryDate) {
    errors.push('Promo code has expired')
  }
  
  // Check usage limit
  if (this.usageLimit !== null && this.usedCount >= this.usageLimit) {
    errors.push('Promo code usage limit exceeded')
  }
  
  // Check minimum order amount
  if (orderAmount < this.minOrderAmount) {
    errors.push(`Minimum order amount of ₹${this.minOrderAmount} required`)
  }
  
  // Check category restrictions
  if (this.applicableCategories.length > 0 && !this.applicableCategories.includes(experienceCategory)) {
    errors.push('Promo code not applicable for this experience category')
  }
  
  // Check excluded experiences
  if (this.excludedExperiences.includes(experienceId)) {
    errors.push('Promo code not applicable for this experience')
  }
  
  // Check first-time user restriction
  if (this.firstTimeUserOnly && !isFirstTimeUser) {
    errors.push('Promo code is only valid for first-time users')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Method to calculate discount amount
promoCodeSchema.methods.calculateDiscount = function(orderAmount) {
  let discount = 0
  
  if (this.discountType === 'percentage') {
    discount = (orderAmount * this.discountValue) / 100
  } else if (this.discountType === 'fixed') {
    discount = this.discountValue
  }
  
  // Apply maximum discount limit if set
  if (this.maxDiscountAmount !== null && discount > this.maxDiscountAmount) {
    discount = this.maxDiscountAmount
  }
  
  // Ensure discount doesn't exceed order amount
  discount = Math.min(discount, orderAmount)
  
  return Math.round(discount * 100) / 100 // Round to 2 decimal places
}

// Method to use promo code (increment usage count)
promoCodeSchema.methods.use = function() {
  this.usedCount += 1
  return this.save()
}

// Static method to find valid promo codes
promoCodeSchema.statics.findValidCodes = function() {
  const now = new Date()
  return this.find({
    isActive: true,
    startDate: { $lte: now },
    expiryDate: { $gte: now },
    $or: [
      { usageLimit: null },
      { $expr: { $lt: ['$usedCount', '$usageLimit'] } }
    ]
  })
}

// Static method to find promo code by code string
promoCodeSchema.statics.findByCode = function(code) {
  return this.findOne({ code: code.toUpperCase() })
}

// Index for better query performance
promoCodeSchema.index({ isActive: 1, expiryDate: 1 })
promoCodeSchema.index({ startDate: 1, expiryDate: 1 })

const PromoCode = mongoose.model('PromoCode', promoCodeSchema)

export default PromoCode