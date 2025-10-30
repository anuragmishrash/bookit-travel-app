import { useState } from 'react'
import { bookingAPI } from '../services/api'

export const useBooking = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const createBooking = async (bookingData) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await bookingAPI.create(bookingData)
      return { success: true, data: response.data }
    } catch (err) {
      const errorMessage = err.message || 'Failed to create booking'
      setError(errorMessage)
      return { success: false, error: err }
    } finally {
      setLoading(false)
    }
  }

  const getBooking = async (bookingId) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await bookingAPI.getById(bookingId)
      return { success: true, data: response.data }
    } catch (err) {
      const errorMessage = err.message || 'Failed to get booking'
      setError(errorMessage)
      return { success: false, error: err }
    } finally {
      setLoading(false)
    }
  }

  const cancelBooking = async (bookingId) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await bookingAPI.cancel(bookingId)
      return { success: true, data: response.data }
    } catch (err) {
      const errorMessage = err.message || 'Failed to cancel booking'
      setError(errorMessage)
      return { success: false, error: err }
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    createBooking,
    getBooking,
    cancelBooking,
    clearError: () => setError(null)
  }
}