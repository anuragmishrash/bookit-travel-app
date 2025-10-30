import { useState } from 'react'
import { useForm } from 'react-hook-form'
import PromoCodeInput from './PromoCodeInput'
import CheckoutSummary from './CheckoutSummary'
import LoadingSpinner from '../common/LoadingSpinner'
import { bookingAPI } from '../../services/api'
import { isValidEmail, isValidName, formatDate } from '../../utils/helpers'

const CheckoutForm = ({ bookingData, onBookingComplete, onBack }) => {
  const [loading, setLoading] = useState(false)
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [appliedPromoCode, setAppliedPromoCode] = useState(null)
  const [error, setError] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm()

  const watchedFields = watch()

  // Calculate final pricing with promo discount
  const finalPricing = {
    ...bookingData.pricing,
    discount: promoDiscount,
    total: bookingData.pricing.subtotal + bookingData.pricing.taxes - promoDiscount,
    promoCode: appliedPromoCode
  }

  const handlePromoApplied = (discount, promoCode) => {
    setPromoDiscount(discount)
    setAppliedPromoCode(promoCode)
  }

  const handlePromoRemoved = () => {
    setPromoDiscount(0)
    setAppliedPromoCode(null)
  }

  const onSubmit = async (formData) => {
    try {
      setLoading(true)
      setError(null)

      // Validate form data
      if (!isValidName(formData.fullName)) {
        throw new Error('Please enter a valid full name')
      }

      if (!isValidEmail(formData.email)) {
        throw new Error('Please enter a valid email address')
      }

      if (!formData.agreeToTerms) {
        throw new Error('Please agree to the terms and safety policy')
      }

      // Prepare booking payload
      const bookingPayload = {
        experienceId: bookingData.experienceId,
        customerInfo: {
          fullName: formData.fullName.trim(),
          email: formData.email.toLowerCase().trim()
        },
        bookingDetails: {
          date: new Date(bookingData.date).toISOString(),
          time: bookingData.time,
          quantity: bookingData.quantity
        },
        pricing: {
          subtotal: finalPricing.subtotal,
          taxes: finalPricing.taxes,
          discount: finalPricing.discount || 0,
          total: finalPricing.total
        },
        promoCode: appliedPromoCode || null
      }

      console.log('Booking payload:', JSON.stringify(bookingPayload, null, 2))

      // Submit booking
      const response = await bookingAPI.create(bookingPayload)
      
      // Handle success
      onBookingComplete({
        success: true,
        data: response.data,
        message: response.message
      })

    } catch (err) {
      console.error('Booking error:', err)
      setError(err.message || 'Failed to create booking. Please try again.')
      
      // Handle booking failure
      onBookingComplete({
        success: false,
        error: {
          message: err.message || 'Booking failed',
          code: err.code || 'BOOKING_ERROR'
        }
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Form */}
      <div className="lg:col-span-2">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Customer Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full name
                </label>
                <input
                  type="text"
                  id="fullName"
                  placeholder="John Doe"
                  {...register('fullName', {
                    required: 'Full name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters'
                    },
                    maxLength: {
                      value: 100,
                      message: 'Name cannot exceed 100 characters'
                    }
                  })}
                  className={`input-field ${errors.fullName ? 'border-red-500' : ''}`}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="test@test.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Please enter a valid email address'
                    }
                  })}
                  className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Promo Code */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Promo Code
            </h3>
            <PromoCodeInput
              orderAmount={bookingData.pricing.subtotal}
              experienceId={bookingData.experienceId}
              onPromoApplied={handlePromoApplied}
              onPromoRemoved={handlePromoRemoved}
              appliedPromoCode={appliedPromoCode}
            />
          </div>

          {/* Terms and Conditions */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="agreeToTerms"
                {...register('agreeToTerms', {
                  required: 'You must agree to the terms and safety policy'
                })}
                className="mt-1 mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="agreeToTerms" className="text-sm text-gray-700">
                I agree to the terms and safety policy
              </label>
            </div>
            {errors.agreeToTerms && (
              <p className="text-red-500 text-sm mt-2">{errors.agreeToTerms.message}</p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={onBack}
              className="btn-secondary flex-1"
              disabled={loading}
            >
              Back
            </button>
            
            <button
              type="submit"
              disabled={loading || !watchedFields.fullName || !watchedFields.email || !watchedFields.agreeToTerms}
              className="btn-primary flex-1 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Processing...
                </>
              ) : (
                'Pay and Confirm'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Right Column - Summary */}
      <div className="lg:col-span-1">
        <div className="sticky top-4">
          <CheckoutSummary
            bookingData={bookingData}
            pricing={finalPricing}
            appliedPromoCode={appliedPromoCode}
          />
        </div>
      </div>
    </div>
  )
}

export default CheckoutForm