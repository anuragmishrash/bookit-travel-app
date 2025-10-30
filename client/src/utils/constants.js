// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Experience Categories
export const EXPERIENCE_CATEGORIES = [
  { value: 'adventure', label: 'Adventure' },
  { value: 'nature', label: 'Nature' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'water-sports', label: 'Water Sports' },
  { value: 'hiking', label: 'Hiking' },
  { value: 'sightseeing', label: 'Sightseeing' }
]

// Booking Status
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed'
}

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded'
}

// Tax Rate (18% GST)
export const TAX_RATE = 0.18

// Date Format
export const DATE_FORMAT = 'YYYY-MM-DD'
export const DISPLAY_DATE_FORMAT = 'MMM DD, YYYY'

// Time Slots
export const COMMON_TIME_SLOTS = [
  '07:00 am',
  '09:00 am',
  '11:00 am',
  '01:00 pm',
  '03:00 pm',
  '05:00 pm'
]

// Validation Rules
export const VALIDATION_RULES = {
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  PROMO_CODE: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
    PATTERN: /^[A-Z0-9]+$/
  },
  QUANTITY: {
    MIN: 1,
    MAX: 20
  }
}

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  EXPERIENCE_NOT_FOUND: 'Experience not found.',
  SLOT_NOT_AVAILABLE: 'Selected time slot is not available.',
  BOOKING_FAILED: 'Booking failed. Please try again.',
  PROMO_CODE_INVALID: 'Invalid promo code.',
  FORM_INCOMPLETE: 'Please fill in all required fields.'
}

// Success Messages
export const SUCCESS_MESSAGES = {
  BOOKING_CREATED: 'Booking created successfully!',
  PROMO_CODE_APPLIED: 'Promo code applied successfully!',
  BOOKING_CANCELLED: 'Booking cancelled successfully.'
}

// Loading States
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
}

// Local Storage Keys
export const STORAGE_KEYS = {
  BOOKING_DATA: 'bookit_booking_data',
  SEARCH_HISTORY: 'bookit_search_history',
  USER_PREFERENCES: 'bookit_user_preferences'
}

// Breakpoints (matching Tailwind CSS)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
}