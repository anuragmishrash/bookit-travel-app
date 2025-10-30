import { useState } from 'react'
import DatePicker from '../booking/DatePicker'
import TimeSlotSelector from '../booking/TimeSlotSelector'
import PriceSummary from '../booking/PriceSummary'
import { formatCurrency, formatCategory, calculateTaxes, calculateTotal } from '../../utils/helpers'

const ExperienceDetails = ({ experience, onBookingSelect }) => {
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [quantity, setQuantity] = useState(1)

  const {
    _id,
    title,
    description,
    location,
    price,
    image,
    category,
    duration,
    minAge,
    maxGroupSize,
    includes,
    availableSlots,
    rating,
    reviewCount
  } = experience

  // Get available slots for selected date
  const getAvailableSlotsForDate = (date) => {
    if (!date || !availableSlots) return []
    
    const targetDate = new Date(date)
    targetDate.setHours(0, 0, 0, 0)
    
    const slot = availableSlots.find(slot => {
      const slotDate = new Date(slot.date)
      slotDate.setHours(0, 0, 0, 0)
      return slotDate.getTime() === targetDate.getTime()
    })
    
    return slot ? slot.times.filter(time => 
      time.available && time.currentBookings < time.maxCapacity
    ) : []
  }

  // Calculate pricing
  const subtotal = price * quantity
  const taxes = calculateTaxes(subtotal)
  const total = calculateTotal(subtotal, taxes)
  
  console.log('ExperienceDetails pricing:', { price, quantity, subtotal, taxes, total })

  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date)
    setSelectedTime(null) // Reset time when date changes
  }

  // Handle time selection
  const handleTimeSelect = (time) => {
    setSelectedTime(time)
  }

  // Handle quantity change
  const handleQuantityChange = (newQuantity) => {
    setQuantity(Math.max(1, Math.min(newQuantity, maxGroupSize)))
  }

  // Handle booking confirmation
  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) return

    const bookingData = {
      experienceId: _id,
      experienceTitle: title,
      experienceImage: image,
      experienceLocation: location,
      date: selectedDate,
      time: selectedTime,
      quantity,
      pricing: {
        subtotal: subtotal,
        taxes: taxes,
        total: total,
        pricePerPerson: price,
        discount: 0
      }
    }

    console.log('Storing booking data:', bookingData)
    // Store in localStorage immediately
    localStorage.setItem('bookit_booking_data', JSON.stringify(bookingData))
    
    onBookingSelect(bookingData)
  }

  const availableTimesForSelectedDate = selectedDate ? getAvailableSlotsForDate(selectedDate) : []
  const canConfirm = selectedDate && selectedTime && quantity > 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Experience Details */}
      <div className="lg:col-span-2">
        {/* Hero Image */}
        <div className="relative h-64 md:h-80 rounded-lg overflow-hidden mb-6">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
          
          {/* Category Badge */}
          {category && (
            <div className="absolute top-4 left-4">
              <span className="bg-primary-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                {formatCategory(category)}
              </span>
            </div>
          )}
        </div>

        {/* Experience Info */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {title}
          </h1>
          
          <p className="text-lg text-gray-600 mb-4">
            {location}
          </p>

          {/* Rating */}
          {rating > 0 && (
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                <span className="text-yellow-400 text-lg">★</span>
                <span className="text-lg font-medium text-gray-900 ml-2">
                  {rating.toFixed(1)}
                </span>
              </div>
              {reviewCount > 0 && (
                <span className="text-gray-500 ml-2">
                  ({reviewCount} reviews)
                </span>
              )}
            </div>
          )}

          <p className="text-gray-700 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Experience Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Experience Details
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Min Age:</span>
                <span className="font-medium">{minAge} years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Group Size:</span>
                <span className="font-medium">Max {maxGroupSize} people</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Price:</span>
                <span className="font-medium">{formatCurrency(price)} per person</span>
              </div>
            </div>
          </div>

          {includes && includes.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                What's Included
              </h3>
              <ul className="space-y-1 text-sm">
                {includes.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2 mt-0.5">✓</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Date Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Choose date
          </h3>
          <DatePicker
            availableSlots={availableSlots}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
          />
        </div>

        {/* Time Selection */}
        {selectedDate && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Choose time
            </h3>
            <TimeSlotSelector
              availableSlots={availableTimesForSelectedDate}
              selectedTime={selectedTime}
              onTimeSelect={handleTimeSelect}
            />
            <p className="text-xs text-gray-500 mt-2">
              All times are in IST (GMT +5:30)
            </p>
          </div>
        )}

        {/* About Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            About
          </h3>
          <div className="bg-gray-100 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              Scenic routes, trained guides, and safety briefing. Minimum age 10.
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - Booking Summary */}
      <div className="lg:col-span-1">
        <div className="sticky top-4">
          <PriceSummary
            price={price}
            quantity={quantity}
            subtotal={subtotal}
            taxes={taxes}
            total={total}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            experienceTitle={title}
            onQuantityChange={handleQuantityChange}
            onConfirm={handleConfirm}
            canConfirm={canConfirm}
            maxQuantity={maxGroupSize}
          />
        </div>
      </div>
    </div>
  )
}

export default ExperienceDetails