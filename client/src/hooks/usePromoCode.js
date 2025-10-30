import { useState } from 'react'
import { promoAPI } from '../services/api'

export const usePromoCode = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const validatePromoCode = async (code, orderAmount, experienceId) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await promoAPI.validate(code, orderAmount, experienceId)
      return { 
        success: true, 
        data: response.data,
        discountAmount: response.data.orderSummary.discountAmount
      }
    } catch (err) {
      const errorMessage = err.message || 'Invalid promo code'
      setError(errorMessage)
      return { success: false, error: err }
    } finally {
      setLoading(false)
    }
  }

  const getActivePromoCodes = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await promoAPI.getActive()
      return { success: true, data: response.data }
    } catch (err) {
      const errorMessage = err.message || 'Failed to load promo codes'
      setError(errorMessage)
      return { success: false, error: err }
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    validatePromoCode,
    getActivePromoCodes,
    clearError: () => setError(null)
  }
}