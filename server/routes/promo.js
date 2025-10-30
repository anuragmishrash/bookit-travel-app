import express from 'express'
import { 
  validatePromoCode, 
  getActivePromoCodes,
  getPromoCodeByCode
} from '../controllers/promoController.js'
import { body, param } from 'express-validator'
import { validateRequest } from '../middleware/validation.js'

const router = express.Router()

// Validation rules
const validatePromoCodeValidation = [
  body('code')
    .trim()
    .toUpperCase()
    .isLength({ min: 3, max: 20 })
    .matches(/^[A-Z0-9]+$/)
    .withMessage('Promo code must be 3-20 characters and contain only letters and numbers'),
  
  body('orderAmount')
    .isFloat({ min: 0 })
    .withMessage('Order amount must be a positive number'),
  
  body('experienceId')
    .optional()
    .isMongoId()
    .withMessage('Invalid experience ID')
]

const getPromoCodeByCodeValidation = [
  param('code')
    .trim()
    .toUpperCase()
    .isLength({ min: 3, max: 20 })
    .matches(/^[A-Z0-9]+$/)
    .withMessage('Invalid promo code format')
]

// Routes
router.post('/validate', validatePromoCodeValidation, validateRequest, validatePromoCode)
router.get('/active', getActivePromoCodes)
router.get('/:code', getPromoCodeByCodeValidation, validateRequest, getPromoCodeByCode)

export default router