import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth tokens here if needed
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    // Handle common errors
    const errorMessage = error.response?.data?.error?.message || error.message || 'An error occurred'
    const errorCode = error.response?.data?.error?.code || 'UNKNOWN_ERROR'
    
    return Promise.reject({
      message: errorMessage,
      code: errorCode,
      status: error.response?.status,
      details: error.response?.data?.error?.details
    })
  }
)

// Experience API calls
export const experienceAPI = {
  // Get all experiences with optional filters
  getAll: (params = {}) => {
    return api.get('/experiences', { params })
  },

  // Get single experience by ID
  getById: (id) => {
    return api.get(`/experiences/${id}`)
  },

  // Get available slots for experience on specific date
  getSlots: (id, date) => {
    return api.get(`/experiences/${id}/slots/${date}`)
  },

  // Get categories
  getCategories: () => {
    return api.get('/experiences/categories')
  },

  // Get locations
  getLocations: () => {
    return api.get('/experiences/locations')
  }
}

// Booking API calls
export const bookingAPI = {
  // Create new booking
  create: (bookingData) => {
    return api.post('/bookings', bookingData)
  },

  // Get booking by ID
  getById: (bookingId) => {
    return api.get(`/bookings/${bookingId}`)
  },

  // Get bookings by customer email
  getByEmail: (email) => {
    return api.get(`/bookings/customer/${email}`)
  },

  // Cancel booking
  cancel: (bookingId) => {
    return api.put(`/bookings/${bookingId}/cancel`)
  }
}

// Promo code API calls
export const promoAPI = {
  // Validate promo code
  validate: (code, orderAmount, experienceId) => {
    return api.post('/promo/validate', {
      code,
      orderAmount,
      experienceId
    })
  },

  // Get active promo codes
  getActive: () => {
    return api.get('/promo/active')
  },

  // Get promo code by code
  getByCode: (code) => {
    return api.get(`/promo/${code}`)
  }
}

// Health check
export const healthCheck = () => {
  return api.get('/health')
}

export default api