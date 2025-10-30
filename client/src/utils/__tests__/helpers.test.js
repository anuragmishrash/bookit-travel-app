import { describe, it, expect } from 'vitest'
import { 
  formatCurrency, 
  calculateTaxes, 
  calculateTotal,
  isValidEmail,
  isValidName,
  formatDate
} from '../helpers'

describe('Helper Functions', () => {
  describe('formatCurrency', () => {
    it('formats currency correctly', () => {
      expect(formatCurrency(999)).toBe('₹999')
      expect(formatCurrency(1000)).toBe('₹1,000')
      expect(formatCurrency(1234.56)).toBe('₹1,235')
    })
  })

  describe('calculateTaxes', () => {
    it('calculates 18% tax correctly', () => {
      expect(calculateTaxes(1000)).toBe(180)
      expect(calculateTaxes(500)).toBe(90)
    })
  })

  describe('calculateTotal', () => {
    it('calculates total with taxes and discount', () => {
      expect(calculateTotal(1000, 180, 100)).toBe(1080)
      expect(calculateTotal(500, 90, 0)).toBe(590)
    })
  })

  describe('isValidEmail', () => {
    it('validates email addresses correctly', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user@domain.co.uk')).toBe(true)
      expect(isValidEmail('invalid-email')).toBe(false)
      expect(isValidEmail('test@')).toBe(false)
      expect(isValidEmail('@domain.com')).toBe(false)
    })
  })

  describe('isValidName', () => {
    it('validates names correctly', () => {
      expect(isValidName('John Doe')).toBe(true)
      expect(isValidName('A')).toBe(false)
      expect(isValidName('')).toBe(false)
      expect(isValidName('   ')).toBe(false)
    })
  })

  describe('formatDate', () => {
    it('formats dates correctly', () => {
      const date = new Date('2025-10-22')
      const formatted = formatDate(date)
      expect(formatted).toMatch(/Oct 22, 2025/)
    })
  })
})