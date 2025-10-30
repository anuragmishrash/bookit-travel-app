import { useState, useEffect } from 'react'
import { experienceAPI } from '../services/api'

export const useExperiences = (params = {}) => {
  const [experiences, setExperiences] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState(null)

  const fetchExperiences = async (searchParams = params) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await experienceAPI.getAll(searchParams)
      
      setExperiences(response.data.experiences)
      setPagination(response.data.pagination)
    } catch (err) {
      setError(err.message || 'Failed to load experiences')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExperiences(params)
  }, [JSON.stringify(params)])

  return {
    experiences,
    loading,
    error,
    pagination,
    refetch: fetchExperiences
  }
}

export const useExperience = (id) => {
  const [experience, setExperience] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchExperience = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await experienceAPI.getById(id)
      setExperience(response.data)
    } catch (err) {
      setError(err.message || 'Failed to load experience')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchExperience()
    }
  }, [id])

  return {
    experience,
    loading,
    error,
    refetch: fetchExperience
  }
}