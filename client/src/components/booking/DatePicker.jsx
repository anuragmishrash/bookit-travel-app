import { formatDateForAPI, getMonthDay, getDayName, isPastDate } from '../../utils/helpers'

const DatePicker = ({ availableSlots, selectedDate, onDateSelect }) => {
  // Filter out past dates and get unique available dates
  const getAvailableDates = () => {
    if (!availableSlots) return []
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    return availableSlots
      .filter(slot => {
        const slotDate = new Date(slot.date)
        slotDate.setHours(0, 0, 0, 0)
        
        // Only show dates that are today or in the future
        return slotDate >= today && slot.times.some(time => 
          time.available && time.currentBookings < time.maxCapacity
        )
      })
      .map(slot => new Date(slot.date))
      .sort((a, b) => a - b)
  }

  const availableDates = getAvailableDates()

  const handleDateClick = (date) => {
    const dateString = formatDateForAPI(date)
    onDateSelect(dateString)
  }

  const isDateSelected = (date) => {
    if (!selectedDate) return false
    const dateString = formatDateForAPI(date)
    return dateString === selectedDate
  }

  if (availableDates.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-600">
          No available dates at the moment. Please check back later.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-3">
      {availableDates.map((date, index) => {
        const isSelected = isDateSelected(date)
        
        return (
          <button
            key={index}
            onClick={() => handleDateClick(date)}
            className={`
              flex flex-col items-center px-4 py-3 rounded-lg border-2 transition-all duration-200 min-w-[80px]
              ${isSelected 
                ? 'border-primary-500 bg-primary-500 text-white' 
                : 'border-gray-200 bg-white text-gray-700 hover:border-primary-300 hover:bg-primary-50'
              }
            `}
          >
            <span className="text-xs font-medium uppercase tracking-wide">
              {getDayName(date)}
            </span>
            <span className="text-sm font-semibold mt-1">
              {getMonthDay(date)}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default DatePicker