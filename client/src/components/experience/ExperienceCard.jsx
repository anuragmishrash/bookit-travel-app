import { Link } from 'react-router-dom'
import { formatCurrency, formatCategory } from '../../utils/helpers'

const ExperienceCard = ({ experience }) => {
  const {
    _id,
    title,
    location,
    price,
    image,
    description,
    category,
    rating,
    reviewCount
  } = experience

  return (
    <div className="card hover:shadow-lg transition-shadow duration-300">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Category Badge */}
        {category && (
          <div className="absolute top-3 left-3">
            <span className="bg-primary-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              {formatCategory(category)}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title and Location */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {title}
          </h3>
          <p className="text-sm text-gray-600">
            {location}
          </p>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-700 mb-4 line-clamp-2">
          {description}
        </p>

        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              <span className="text-yellow-400">★</span>
              <span className="text-sm font-medium text-gray-900 ml-1">
                {rating.toFixed(1)}
              </span>
            </div>
            {reviewCount > 0 && (
              <span className="text-sm text-gray-500 ml-2">
                ({reviewCount} reviews)
              </span>
            )}
          </div>
        )}

        {/* Price and Button */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-gray-600">From </span>
            <span className="text-lg font-bold text-gray-900">
              {formatCurrency(price)}
            </span>
          </div>
          
          <Link
            to={`/experience/${_id}`}
            className="bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ExperienceCard