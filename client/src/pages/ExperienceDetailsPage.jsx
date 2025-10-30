import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ExperienceDetails from '../components/experience/ExperienceDetails'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import { experienceAPI } from '../services/api'

const ExperienceDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [experience, setExperience] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchExperience()
  }, [id])

  const fetchExperience = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await experienceAPI.getById(id)
      setExperience(response.data)
    } catch (err) {
      setError(err.message || 'Failed to load experience details')
    } finally {
      setLoading(false)
    }
  }

  const handleBookingSelect = (bookingData) => {
    // Store booking data in localStorage for checkout
    localStorage.setItem('bookit_booking_data', JSON.stringify(bookingData))
    navigate('/checkout')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorMessage message={error} onRetry={fetchExperience} />
      </div>
    )
  }

  if (!experience) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Experience not found
          </h2>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ExperienceDetails 
        experience={experience} 
        onBookingSelect={handleBookingSelect}
      />
    </div>
  )
}

export default ExperienceDetailsPage