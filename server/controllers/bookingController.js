import Booking from '../models/Booking.js'
import Experience from '../models/Experience.js'
import PromoCode from '../models/PromoCode.js'
import { validationResult } from 'express-validator'

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Public
export const createBooking = async (req, res, next) => {
  try {
    console.log('📝 Booking request received:', JSON.stringify(req.body, null, 2))
    
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.log('❌ Booking validation errors:', JSON.stringify(errors.array(), null, 2))
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: errors.array()
        }
      })
    }

    const {
      experienceId,
      customerInfo,
      bookingDetails,
      pricing,
      promoCode
    } = req.body

    // Find the experience
    const experience = await Experience.findById(experienceId)
    if (!experience) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Experience not found',
          code: 'EXPERIENCE_NOT_FOUND'
        }
      })
    }

    if (!experience.isActive) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Experience is not available for booking',
          code: 'EXPERIENCE_NOT_AVAILABLE'
        }
      })
    }

    // Validate booking date is not in the past
    const bookingDate = new Date(bookingDetails.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (bookingDate < today) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Cannot book for past dates',
          code: 'INVALID_BOOKING_DATE'
        }
      })
    }

    // Check if the requested slot is available
    const availableSlots = experience.getAvailableSlotsForDate(bookingDetails.date)
    const requestedSlot = availableSlots.find(slot => slot.time === bookingDetails.time)

    if (!requestedSlot) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Requested time slot is not available',
          code: 'SLOT_NOT_AVAILABLE'
        }
      })
    }

    // Check if there's enough capacity
    if (requestedSlot.currentBookings + bookingDetails.quantity > requestedSlot.maxCapacity) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Not enough capacity for this booking',
          code: 'INSUFFICIENT_CAPACITY'
        }
      })
    }

    // Validate pricing calculations
    const expectedSubtotal = experience.price * bookingDetails.quantity
    const expectedTaxes = Math.round(expectedSubtotal * 0.18) // 18% GST
    let expectedDiscount = 0

    // Validate promo code if provided
    if (promoCode) {
      const promo = await PromoCode.findByCode(promoCode)
      if (!promo) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Invalid promo code',
            code: 'INVALID_PROMO_CODE'
          }
        })
      }

      const validation = promo.validateForOrder(expectedSubtotal, experience.category, experienceId)
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          error: {
            message: validation.errors[0],
            code: 'PROMO_CODE_VALIDATION_FAILED'
          }
        })
      }

      expectedDiscount = promo.calculateDiscount(expectedSubtotal)
    }

    const expectedTotal = expectedSubtotal + expectedTaxes - expectedDiscount

    // Validate provided pricing
    if (Math.abs(pricing.subtotal - expectedSubtotal) > 0.01 ||
        Math.abs(pricing.taxes - expectedTaxes) > 0.01 ||
        Math.abs(pricing.discount - expectedDiscount) > 0.01 ||
        Math.abs(pricing.total - expectedTotal) > 0.01) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Pricing calculation mismatch',
          code: 'PRICING_MISMATCH'
        }
      })
    }

    // Check for existing bookings to prevent double booking
    const existingBookings = await Booking.findByExperienceAndDate(experienceId, bookingDetails.date)
    const existingBookingForSlot = existingBookings.filter(booking => 
      booking.bookingDetails.time === bookingDetails.time
    )
    
    const totalExistingQuantity = existingBookingForSlot.reduce((sum, booking) => 
      sum + booking.bookingDetails.quantity, 0
    )

    if (totalExistingQuantity + bookingDetails.quantity > requestedSlot.maxCapacity) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Slot capacity exceeded due to concurrent bookings',
          code: 'CONCURRENT_BOOKING_CONFLICT'
        }
      })
    }

    // Create the booking
    const booking = new Booking({
      experienceId,
      customerInfo,
      bookingDetails,
      pricing: {
        ...pricing,
        promoCode: promoCode || undefined
      }
    })

    // Save booking and update experience slot
    await booking.save()

    // Update experience slot availability
    try {
      await experience.bookSlot(bookingDetails.date, bookingDetails.time, bookingDetails.quantity)
    } catch (slotError) {
      // If slot booking fails, remove the booking
      await Booking.findByIdAndDelete(booking._id)
      return res.status(400).json({
        success: false,
        error: {
          message: slotError.message,
          code: 'SLOT_BOOKING_FAILED'
        }
      })
    }

    // Update promo code usage if used
    if (promoCode) {
      const promo = await PromoCode.findByCode(promoCode)
      if (promo) {
        await promo.use()
      }
    }

    // Populate experience details for response
    await booking.populate('experienceId', 'title location image')

    res.status(201).json({
      success: true,
      data: {
        booking: {
          bookingId: booking.bookingId,
          experienceTitle: booking.experienceId.title,
          customerName: booking.customerInfo.fullName,
          date: booking.bookingDetails.date,
          time: booking.bookingDetails.time,
          quantity: booking.bookingDetails.quantity,
          total: booking.pricing.total,
          status: booking.status,
          createdAt: booking.createdAt
        }
      },
      message: 'Booking created successfully'
    })

  } catch (error) {
    next(error)
  }
}

// @desc    Get booking by ID
// @route   GET /api/bookings/:bookingId
// @access  Public
export const getBookingById = async (req, res, next) => {
  try {
    const { bookingId } = req.params

    const booking = await Booking.findOne({ bookingId })
      .populate('experienceId', 'title location image description')

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Booking not found',
          code: 'BOOKING_NOT_FOUND'
        }
      })
    }

    res.status(200).json({
      success: true,
      data: booking
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get bookings by customer email
// @route   GET /api/bookings/customer/:email
// @access  Public
export const getBookingsByEmail = async (req, res, next) => {
  try {
    const { email } = req.params

    const bookings = await Booking.findByCustomerEmail(email)

    res.status(200).json({
      success: true,
      data: bookings
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Cancel booking
// @route   PUT /api/bookings/:bookingId/cancel
// @access  Public
export const cancelBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params

    const booking = await Booking.findOne({ bookingId })
      .populate('experienceId')

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Booking not found',
          code: 'BOOKING_NOT_FOUND'
        }
      })
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Booking is already cancelled',
          code: 'BOOKING_ALREADY_CANCELLED'
        }
      })
    }

    // Check if booking can be cancelled (e.g., not too close to the date)
    const bookingDate = new Date(booking.bookingDetails.date)
    const now = new Date()
    const hoursDifference = (bookingDate - now) / (1000 * 60 * 60)

    if (hoursDifference < 24) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Cannot cancel booking less than 24 hours before the experience',
          code: 'CANCELLATION_TOO_LATE'
        }
      })
    }

    // Update booking status
    booking.status = 'cancelled'
    await booking.save()

    // Release the slot capacity
    const experience = booking.experienceId
    const slotDate = booking.bookingDetails.date
    const slotTime = booking.bookingDetails.time
    const quantity = booking.bookingDetails.quantity

    // Find and update the slot
    const targetDate = new Date(slotDate)
    targetDate.setHours(0, 0, 0, 0)
    
    const slotIndex = experience.availableSlots.findIndex(slot => {
      const slotDateObj = new Date(slot.date)
      slotDateObj.setHours(0, 0, 0, 0)
      return slotDateObj.getTime() === targetDate.getTime()
    })
    
    if (slotIndex !== -1) {
      const timeIndex = experience.availableSlots[slotIndex].times.findIndex(t => t.time === slotTime)
      
      if (timeIndex !== -1) {
        experience.availableSlots[slotIndex].times[timeIndex].currentBookings -= quantity
        experience.availableSlots[slotIndex].times[timeIndex].available = true
        await experience.save()
      }
    }

    res.status(200).json({
      success: true,
      data: booking,
      message: 'Booking cancelled successfully'
    })

  } catch (error) {
    next(error)
  }
}