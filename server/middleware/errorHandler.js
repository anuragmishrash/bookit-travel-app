const errorHandler = (err, req, res, next) => {
  let error = { ...err }
  error.message = err.message

  // Log error
  console.error('❌ Error:', err)

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found'
    error = {
      message,
      code: 'RESOURCE_NOT_FOUND'
    }
    return res.status(404).json({
      success: false,
      error
    })
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered'
    error = {
      message,
      code: 'DUPLICATE_FIELD'
    }
    return res.status(400).json({
      success: false,
      error
    })
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ')
    error = {
      message,
      code: 'VALIDATION_ERROR'
    }
    return res.status(400).json({
      success: false,
      error
    })
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: {
      message: error.message || 'Server Error',
      code: error.code || 'INTERNAL_SERVER_ERROR'
    }
  })
}

export default errorHandler