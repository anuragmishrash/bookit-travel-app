import { Minus, Plus } from 'lucide-react'
import { formatCurrency, formatDate } from '../../utils/helpers'

const PriceSummary = ({
  price,
  quantity,
  subtotal,
  taxes,
  discount = 0,
  total,
  selectedDate,
  selectedTime,
  experienceTitle,
  onQuantityChange,
  onConfirm,
  canConfirm,
  maxQuantity = 20,
  promoCode = null
}) => {
  const handleQuantityDecrease = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1)
    }
  }

  const handleQuantityIncrease = () => {
    if (quantity < maxQuantity) {
      onQuantityChange(quantity + 1)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-semibold text-gray-900">
            Starts at
          </span>
          <span className="text-2xl font-bold text-gray-900">
            {formatCurrency(price)}
          </span>
        </div>
        <p className="text-sm text-gray-600">per person</p>
      </div>

      {/* Selected Details */}
      {(selectedDate || selectedTime) && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">
            {experienceTitle}
          </h4>
          
          {selectedDate && (
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Date</span>
              <span className="font-medium">
                {formatDate(selectedDate)}
              </span>
            </div>
          )}
          
          {selectedTime && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Time</span>
              <span className="font-medium">{selectedTime}</span>
            </div>
          )}
        </div>
      )}

      {/* Quantity Selector */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-900">Quantity</span>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleQuantityDecrease}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Minus className="h-4 w-4" />
            </button>
            
            <span className="text-lg font-semibold w-8 text-center">
              {quantity}
            </span>
            
            <button
              onClick={handleQuantityIncrease}
              disabled={quantity >= maxQuantity}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="mb-6 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">{formatCurrency(subtotal)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Taxes</span>
          <span className="font-medium">{formatCurrency(taxes)}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              Discount {promoCode && `(${promoCode})`}
            </span>
            <span className="font-medium text-green-600">
              -{formatCurrency(discount)}
            </span>
          </div>
        )}
        
        <div className="border-t pt-2">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-900">Total</span>
            <span className="text-xl font-bold text-gray-900">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      </div>

      {/* Confirm Button */}
      <button
        onClick={onConfirm}
        disabled={!canConfirm}
        className={`
          w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200
          ${canConfirm
            ? 'bg-primary-500 hover:bg-primary-600 text-white'
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }
        `}
      >
        {!selectedDate 
          ? 'Select Date' 
          : !selectedTime 
          ? 'Select Time' 
          : 'Confirm'
        }
      </button>
    </div>
  )
}

export default PriceSummary