import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CheckoutForm from '../components/booking/CheckoutForm'
import ErrorMessage from '../components/common/ErrorMessage'

const CheckoutPage = () => {
  const navigate = useNavigate()
  const [bookingData, setBookingData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Get booking data from localStorage
    const storedData = localStorage.getItem('bookit_booking_data')
    
    if (!storedData) {
      // If no booking data, redirect to home instead of showing error
      console.log('No booking data found, redirecting to home')
      navigate('/')
      return
    }

    try {
      const data = JSON.parse(storedData)
      console.log('Loaded booking data:', data)
      setBookingData(data)
    } catch (err) {
      console.error('Error parsing booking data:', err)
      navigate('/')
    }
  }, [])

  const handleBookingComplete = (result) => {
    // Only clear booking data if booking was successful
    if (result.success) {
      localStorage.removeItem('bookit_booking_data')
    }
    
    // Navigate to confirmation page with result
    navigate('/confirmation', { 
      state: { 
        bookingResult: result,
        isSuccess: result.success 
      } 
    })
  }

  const handleBackToExperience = () => {
    // Don't clear booking data when going back
    if (bookingData?.experienceId) {
      navigate(`/experience/${bookingData.experienceId}`)
    } else {
      navigate('/')
    }
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorMessage 
          message={error} 
          onRetry={handleBackToExperience}
          retryText="Back to Experiences"
        />
      </div>
    )
  }

  if (!bookingData) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Loading checkout...
          </h2>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <CheckoutForm 
        bookingData={bookingData}
        onBookingComplete={handleBookingComplete}
        onBack={handleBackToExperience}
      />
    </div>
  )
}

export default CheckoutPage