import express from 'express'
import { 
  createBooking, 
  getBookingById, 
  getBookingsByEmail,
  cancelBooking
} from '../controllers/bookingController.js'
import { body, param } from 'express-validator'
import { validateRequest } from '../middleware/validation.js'

const router = express.Router()

// Validation rules
const createBookingValidation = [
  body('experienceId')
    .isMongoId()
    .withMessage('Invalid experience ID'),
  
  body('customerInfo.fullName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  
  body('customerInfo.email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('bookingDetails.date')
    .isISO8601()
    .withMessage('Invalid date format')
    .custom((value) => {
      const bookingDate = new Date(value)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      // Set booking date to start of day for comparison
      const bookingDateStart = new Date(bookingDate)
      bookingDateStart.setHours(0, 0, 0, 0)
      
      if (bookingDateStart < today) {
        throw new Error('Booking date cannot be in the past')
      }
      return true
    }),
  
  body('bookingDetails.time')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9] (am|pm)$/)
    .withMessage('Time must be in format HH:MM am/pm'),
  
  body('bookingDetails.quantity')
    .isInt({ min: 1, max: 20 })
    .withMessage('Quantity must be between 1 and 20'),
  
  body('pricing.subtotal')
    .isFloat({ min: 0 })
    .withMessage('Subtotal must be a positive number'),
  
  body('pricing.taxes')
    .isFloat({ min: 0 })
    .withMessage('Taxes must be a positive number'),
  
  body('pricing.discount')
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage('Discount must be a positive number'),
  
  body('pricing.total')
    .isFloat({ min: 0 })
    .withMessage('Total must be a positive number'),
  
  body('promoCode')
    .optional({ nullable: true })
    .custom((value) => {
      if (value === null || value === undefined || value === '') {
        return true
      }
      if (typeof value === 'string' && value.length >= 3 && value.length <= 20 && /^[A-Z0-9]+$/.test(value)) {
        return true
      }
      throw new Error('Promo code must be 3-20 characters and contain only letters and numbers')
    })
]

const getBookingByIdValidation = [
  param('bookingId')
    .trim()
    .isLength({ min: 5, max: 20 })
    .withMessage('Invalid booking ID format')
]

const getBookingsByEmailValidation = [
  param('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address')
]

const cancelBookingValidation = [
  param('bookingId')
    .trim()
    .isLength({ min: 5, max: 20 })
    .withMessage('Invalid booking ID format')
]

// Routes
router.post('/', (req, res, next) => {
  console.log('🔍 POST /api/bookings - Request received')
  console.log('📦 Request body:', JSON.stringify(req.body, null, 2))
  next()
}, createBookingValidation, validateRequest, createBooking)
router.get('/:bookingId', getBookingByIdValidation, validateRequest, getBookingById)
router.get('/customer/:email', getBookingsByEmailValidation, validateRequest, getBookingsByEmail)
router.put('/:bookingId/cancel', cancelBookingValidation, validateRequest, cancelBooking)

export default router