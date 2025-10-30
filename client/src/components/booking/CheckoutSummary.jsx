import { formatCurrency, formatDate } from '../../utils/helpers'

const CheckoutSummary = ({ bookingData, pricing, appliedPromoCode }) => {
  const {
    experienceTitle,
    experienceLocation,
    experienceImage,
    date,
    time,
    quantity
  } = bookingData

  const {
    subtotal,
    taxes,
    discount = 0,
    total
  } = pricing

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      {/* Header */}
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Booking Summary
      </h3>

      {/* Experience Details */}
      <div className="mb-6">
        {experienceImage && (
          <div className="w-full h-32 rounded-lg overflow-hidden mb-4">
            <img
              src={experienceImage}
              alt={experienceTitle}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <h4 className="font-semibold text-gray-900 mb-2">
          {experienceTitle}
        </h4>
        
        <p className="text-sm text-gray-600 mb-4">
          {experienceLocation}
        </p>

        {/* Booking Details */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Experience</span>
            <span className="font-medium">{experienceTitle}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Date</span>
            <span className="font-medium">{formatDate(date)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Time</span>
            <span className="font-medium">{time}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Qty</span>
            <span className="font-medium">{quantity}</span>
          </div>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="border-t pt-4 space-y-3">
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
              Discount {appliedPromoCode && `(${appliedPromoCode})`}
            </span>
            <span className="font-medium text-green-600">
              -{formatCurrency(discount)}
            </span>
          </div>
        )}
        
        <div className="border-t pt-3">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-900">Total</span>
            <span className="text-xl font-bold text-gray-900">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Info */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600 text-center">
          Your payment is secured with industry-standard encryption. 
          You will receive a confirmation email after successful payment.
        </p>
      </div>
    </div>
  )
}

export default CheckoutSummary