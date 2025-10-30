import express from 'express'
import { 
  getExperiences, 
  getExperienceById, 
  getAvailableSlots,
  getCategories,
  getLocations
} from '../controllers/experienceController.js'
import { query, param } from 'express-validator'
import { validateRequest } from '../middleware/validation.js'

const router = express.Router()

// Validation rules
const getExperiencesValidation = [
  query('category').optional().isIn(['adventure', 'nature', 'cultural', 'water-sports', 'hiking', 'sightseeing']),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('sortBy').optional().isIn(['title', 'price', 'rating', 'createdAt']),
  query('sortOrder').optional().isIn(['asc', 'desc'])
]

const getExperienceByIdValidation = [
  param('id').isMongoId().withMessage('Invalid experience ID')
]

const getAvailableSlotsValidation = [
  param('id').isMongoId().withMessage('Invalid experience ID'),
  param('date').isISO8601().withMessage('Invalid date format')
]

// Routes
router.get('/categories', getCategories)
router.get('/locations', getLocations)
router.get('/', getExperiencesValidation, validateRequest, getExperiences)
router.get('/:id', getExperienceByIdValidation, validateRequest, getExperienceById)
router.get('/:id/slots/:date', getAvailableSlotsValidation, validateRequest, getAvailableSlots)

export default router