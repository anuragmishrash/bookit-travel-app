import { TAX_RATE } from './constants'

// Format currency to Indian Rupees
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Format date for display
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Format date for API (YYYY-MM-DD)
export const formatDateForAPI = (date) => {
  return new Date(date).toISOString().split('T')[0]
}

// Calculate taxes (18% GST)
export const calculateTaxes = (subtotal) => {
  return Math.round(subtotal * TAX_RATE)
}

// Calculate total price
export const calculateTotal = (subtotal, taxes = 0, discount = 0) => {
  return subtotal + taxes - discount
}

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate name format
export const isValidName = (name) => {
  return name && name.trim().length >= 2 && name.trim().length <= 100
}

// Generate unique ID for local storage
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Debounce function for search
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Get available dates (next 30 days)
export const getAvailableDates = () => {
  const dates = []
  const today = new Date()
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    dates.push(date)
  }
  
  return dates
}

// Check if date is today
export const isToday = (date) => {
  const today = new Date()
  const checkDate = new Date(date)
  
  return checkDate.toDateString() === today.toDateString()
}

// Check if date is in the past
export const isPastDate = (date) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const checkDate = new Date(date)
  checkDate.setHours(0, 0, 0, 0)
  
  return checkDate < today
}

// Get day name from date
export const getDayName = (date) => {
  return new Date(date).toLocaleDateString('en-IN', { weekday: 'short' })
}

// Get month and day from date
export const getMonthDay = (date) => {
  return new Date(date).toLocaleDateString('en-IN', { 
    month: 'short', 
    day: 'numeric' 
  })
}

// Truncate text with ellipsis
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text
  return text.substr(0, maxLength) + '...'
}

// Capitalize first letter
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Convert category to display format
export const formatCategory = (category) => {
  return category
    .split('-')
    .map(word => capitalize(word))
    .join(' ')
}

// Get error message from API error
export const getErrorMessage = (error) => {
  if (typeof error === 'string') return error
  if (error?.message) return error.message
  if (error?.response?.data?.error?.message) return error.response.data.error.message
  return 'An unexpected error occurred'
}

// Local storage helpers
export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return null
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Error writing to localStorage:', error)
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Error removing from localStorage:', error)
    }
  }
}

// URL helpers
export const updateURLParams = (params) => {
  const url = new URL(window.location)
  Object.keys(params).forEach(key => {
    if (params[key]) {
      url.searchParams.set(key, params[key])
    } else {
      url.searchParams.delete(key)
    }
  })
  window.history.replaceState({}, '', url)
}

export const getURLParams = () => {
  const params = new URLSearchParams(window.location.search)
  const result = {}
  for (const [key, value] of params) {
    result[key] = value
  }
  return result
}