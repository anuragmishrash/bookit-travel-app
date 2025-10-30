import PromoCode from '../models/PromoCode.js'
import Experience from '../models/Experience.js'
import { validationResult } from 'express-validator'

// @desc    Validate promo code
// @route   POST /api/promo/validate
// @access  Public
export const validatePromoCode = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: errors.array()
        }
      })
    }

    const { code, orderAmount, experienceId } = req.body

    // Find promo code
    const promoCode = await PromoCode.findByCode(code)

    if (!promoCode) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Promo code not found',
          code: 'PROMO_CODE_NOT_FOUND'
        }
      })
    }

    // Get experience details if provided
    let experience = null
    if (experienceId) {
      experience = await Experience.findById(experienceId)
      if (!experience) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Experience not found',
            code: 'EXPERIENCE_NOT_FOUND'
          }
        })
      }
    }

    // Validate promo code for the order
    const validation = promoCode.validateForOrder(
      orderAmount, 
      experience?.category, 
      experienceId,
      false // For now, we don't track first-time users
    )

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: {
          message: validation.errors[0],
          code: 'PROMO_CODE_INVALID',
          details: validation.errors
        }
      })
    }

    // Calculate discount
    const discountAmount = promoCode.calculateDiscount(orderAmount)

    res.status(200).json({
      success: true,
      data: {
        promoCode: {
          code: promoCode.code,
          description: promoCode.description,
          discountType: promoCode.discountType,
          discountValue: promoCode.discountValue,
          discountAmount,
          maxDiscountAmount: promoCode.maxDiscountAmount,
          minOrderAmount: promoCode.minOrderAmount
        },
        orderSummary: {
          originalAmount: orderAmount,
          discountAmount,
          finalAmount: orderAmount - discountAmount
        }
      },
      message: 'Promo code is valid'
    })

  } catch (error) {
    next(error)
  }
}

// @desc    Get all active promo codes (for admin or testing)
// @route   GET /api/promo/active
// @access  Public (in production, this should be protected)
export const getActivePromoCodes = async (req, res, next) => {
  try {
    const promoCodes = await PromoCode.findValidCodes()
      .select('code description discountType discountValue minOrderAmount maxDiscountAmount expiryDate remainingUses')

    res.status(200).json({
      success: true,
      data: promoCodes
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get promo code details by code
// @route   GET /api/promo/:code
// @access  Public
export const getPromoCodeByCode = async (req, res, next) => {
  try {
    const { code } = req.params

    const promoCode = await PromoCode.findByCode(code)
      .select('code description discountType discountValue minOrderAmount maxDiscountAmount expiryDate isActive')

    if (!promoCode) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Promo code not found',
          code: 'PROMO_CODE_NOT_FOUND'
        }
      })
    }

    // Don't reveal inactive promo codes
    if (!promoCode.isCurrentlyValid) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Promo code not found',
          code: 'PROMO_CODE_NOT_FOUND'
        }
      })
    }

    res.status(200).json({
      success: true,
      data: promoCode
    })
  } catch (error) {
    next(error)
  }
}