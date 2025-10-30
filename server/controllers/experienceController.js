import Experience from '../models/Experience.js'
import { validationResult } from 'express-validator'

// @desc    Get all experiences
// @route   GET /api/experiences
// @access  Public
export const getExperiences = async (req, res, next) => {
  try {
    const { 
      category, 
      location, 
      minPrice, 
      maxPrice, 
      search,
      sortBy = 'displayOrder',
      sortOrder = 'asc',
      page = 1,
      limit = 20
    } = req.query

    // Build filter object
    const filter = { isActive: true }

    if (category) {
      filter.category = category
    }

    if (location) {
      filter.location = { $regex: location, $options: 'i' }
    }

    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = Number(minPrice)
      if (maxPrice) filter.price.$lte = Number(maxPrice)
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ]
    }

    // Build sort object
    const sort = {}
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit)

    // Execute query
    const experiences = await Experience.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .select('-__v')

    // Get total count for pagination
    const total = await Experience.countDocuments(filter)

    // Calculate pagination info
    const totalPages = Math.ceil(total / Number(limit))
    const hasNextPage = Number(page) < totalPages
    const hasPrevPage = Number(page) > 1

    res.status(200).json({
      success: true,
      data: {
        experiences,
        pagination: {
          currentPage: Number(page),
          totalPages,
          totalItems: total,
          itemsPerPage: Number(limit),
          hasNextPage,
          hasPrevPage
        }
      }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single experience by ID
// @route   GET /api/experiences/:id
// @access  Public
export const getExperienceById = async (req, res, next) => {
  try {
    const { id } = req.params

    const experience = await Experience.findById(id).select('-__v')

    if (!experience) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Experience not found',
          code: 'EXPERIENCE_NOT_FOUND'
        }
      })
    }

    if (!experience.isActive) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Experience is not available',
          code: 'EXPERIENCE_NOT_AVAILABLE'
        }
      })
    }

    // Filter out past dates and unavailable slots
    const now = new Date()
    now.setHours(0, 0, 0, 0)

    const availableSlots = experience.availableSlots
      .filter(slot => new Date(slot.date) >= now)
      .map(slot => ({
        ...slot.toObject(),
        times: slot.times.filter(time => 
          time.available && time.currentBookings < time.maxCapacity
        )
      }))
      .filter(slot => slot.times.length > 0)

    const experienceData = {
      ...experience.toObject(),
      availableSlots
    }

    res.status(200).json({
      success: true,
      data: experienceData
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get available slots for experience on specific date
// @route   GET /api/experiences/:id/slots/:date
// @access  Public
export const getAvailableSlots = async (req, res, next) => {
  try {
    const { id, date } = req.params

    const experience = await Experience.findById(id)

    if (!experience) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Experience not found',
          code: 'EXPERIENCE_NOT_FOUND'
        }
      })
    }

    const availableSlots = experience.getAvailableSlotsForDate(date)

    res.status(200).json({
      success: true,
      data: {
        date,
        slots: availableSlots
      }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get experience categories
// @route   GET /api/experiences/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Experience.distinct('category', { isActive: true })

    res.status(200).json({
      success: true,
      data: categories
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get experience locations
// @route   GET /api/experiences/locations
// @access  Public
export const getLocations = async (req, res, next) => {
  try {
    const locations = await Experience.distinct('location', { isActive: true })

    res.status(200).json({
      success: true,
      data: locations
    })
  } catch (error) {
    next(error)
  }
}