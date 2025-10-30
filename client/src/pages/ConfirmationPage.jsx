import { useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle, XCircle, Home } from 'lucide-react'

const ConfirmationPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  
  const { bookingResult, isSuccess } = location.state || {}

  // If no booking result, redirect to home
  if (!bookingResult) {
    navigate('/')
    return null
  }

  const handleBackToHome = () => {
    navigate('/')
  }

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Booking Confirmed
          </h1>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 inline-block">
            <p className="text-green-800 font-medium">
              Ref ID: {bookingResult.data?.booking?.bookingId}
            </p>
          </div>

          {/* Booking Details */}
          {bookingResult.data?.booking && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 text-left">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Booking Details
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Experience:</span>
                  <span className="font-medium">
                    {bookingResult.data.booking.experienceTitle}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer:</span>
                  <span className="font-medium">
                    {bookingResult.data.booking.customerName}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">
                    {new Date(bookingResult.data.booking.date).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">
                    {bookingResult.data.booking.time}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-medium">
                    {bookingResult.data.booking.quantity}
                  </span>
                </div>
                
                <div className="flex justify-between border-t pt-3">
                  <span className="text-gray-600 font-medium">Total Paid:</span>
                  <span className="font-bold text-lg">
                    ₹{bookingResult.data.booking.total}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          <p className="text-gray-600 mb-8">
            Your booking has been confirmed successfully. You will receive a confirmation email shortly.
          </p>

          {/* Back to Home Button */}
          <button
            onClick={handleBackToHome}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors flex items-center mx-auto"
          >
            <Home className="h-5 w-5 mr-2" />
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  // Error/Failure state
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        {/* Error Icon */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
          <XCircle className="h-8 w-8 text-red-600" />
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Booking Failed
        </h1>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">
            {bookingResult.error?.message || 'Something went wrong with your booking.'}
          </p>
        </div>

        <p className="text-gray-600 mb-8">
          We apologize for the inconvenience. Please try again or contact support if the problem persists.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/checkout')}
            className="btn-primary"
          >
            Try Again
          </button>
          
          <button
            onClick={handleBackToHome}
            className="btn-secondary flex items-center justify-center"
          >
            <Home className="h-5 w-5 mr-2" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationPage