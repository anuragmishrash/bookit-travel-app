import { useState } from 'react'
import { Check, X, Loader2 } from 'lucide-react'
import { promoAPI } from '../../services/api'
import { formatCurrency } from '../../utils/helpers'

const PromoCodeInput = ({ 
  orderAmount, 
  experienceId, 
  onPromoApplied, 
  onPromoRemoved,
  appliedPromoCode 
}) => {
  const [promoCode, setPromoCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      setError('Please enter a promo code')
      return
    }

    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      const response = await promoAPI.validate(
        promoCode.trim().toUpperCase(),
        orderAmount,
        experienceId
      )

      const { discountAmount } = response.data
      
      setSuccess({
        message: `Promo code applied! You saved ${formatCurrency(discountAmount)}`,
        discountAmount
      })
      
      onPromoApplied(discountAmount, promoCode.trim().toUpperCase())
      
    } catch (err) {
      setError(err.message || 'Invalid promo code')
    } finally {
      setLoading(false)
    }
  }

  const handleRemovePromo = () => {
    setPromoCode('')
    setError(null)
    setSuccess(null)
    onPromoRemoved()
  }

  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase()
    setPromoCode(value)
    
    // Clear messages when user starts typing
    if (error || success) {
      setError(null)
      setSuccess(null)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (!appliedPromoCode) {
        handleApplyPromo()
      }
    }
  }

  return (
    <div className="space-y-3">
      {/* Input Row */}
      <div className="flex gap-3">
        <input
          type="text"
          value={promoCode}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Promo code"
          disabled={loading || appliedPromoCode}
          className={`
            flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            ${error ? 'border-red-500' : success ? 'border-green-500' : 'border-gray-300'}
            ${(loading || appliedPromoCode) ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          `}
        />
        
        {appliedPromoCode ? (
          <button
            type="button"
            onClick={handleRemovePromo}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center"
          >
            <X className="h-4 w-4 mr-1" />
            Remove
          </button>
        ) : (
          <button
            type="button"
            onClick={handleApplyPromo}
            disabled={loading || !promoCode.trim()}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Apply'
            )}
          </button>
        )}
      </div>

      {/* Success Message */}
      {success && (
        <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
          <Check className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
          <p className="text-green-800 text-sm">{success.message}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
          <X className="h-4 w-4 text-red-600 mr-2 flex-shrink-0" />
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Available Promo Codes Hint */}
      {!appliedPromoCode && !success && (
        <div className="text-xs text-gray-500">
          Try: SAVE10 for 10% off or FLAT100 for ₹100 off
        </div>
      )}
    </div>
  )
}

export default PromoCodeInput