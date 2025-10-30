import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import ExperienceGrid from '../components/experience/ExperienceGrid'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import { experienceAPI } from '../services/api'
import { getURLParams } from '../utils/helpers'

const HomePage = () => {
  const [experiences, setExperiences] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchParams] = useSearchParams()

  useEffect(() => {
    fetchExperiences()
  }, [searchParams])

  const fetchExperiences = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = getURLParams()
      const response = await experienceAPI.getAll(params)
      
      setExperiences(response.data.experiences)
    } catch (err) {
      setError(err.message || 'Failed to load experiences')
    } finally {
      setLoading(false)
    }
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
        <ErrorMessage message={error} onRetry={fetchExperiences} />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {searchParams.get('search') && (
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Search results for "{searchParams.get('search')}"
          </h2>
          <p className="text-gray-600 mt-1">
            {experiences.length} experience{experiences.length !== 1 ? 's' : ''} found
          </p>
        </div>
      )}
      
      <ExperienceGrid experiences={experiences} />
      
      {experiences.length === 0 && !loading && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No experiences found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search criteria or browse all experiences.
          </p>
        </div>
      )}
    </div>
  )
}

export default HomePage