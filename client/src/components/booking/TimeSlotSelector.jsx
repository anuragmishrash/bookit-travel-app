const TimeSlotSelector = ({ availableSlots, selectedTime, onTimeSelect }) => {
  const handleTimeClick = (time) => {
    onTimeSelect(time)
  }

  const getSlotStatus = (slot) => {
    const remainingCapacity = slot.maxCapacity - slot.currentBookings
    
    if (!slot.available || remainingCapacity <= 0) {
      return { status: 'sold-out', text: 'Sold out' }
    }
    
    if (remainingCapacity <= 2) {
      return { status: 'limited', text: `${remainingCapacity} left` }
    }
    
    return { status: 'available', text: 'Available' }
  }

  if (!availableSlots || availableSlots.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-600">
          No available time slots for the selected date.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {availableSlots.map((slot, index) => {
        const isSelected = selectedTime === slot.time
        const slotStatus = getSlotStatus(slot)
        const isDisabled = slotStatus.status === 'sold-out'
        
        return (
          <button
            key={index}
            onClick={() => !isDisabled && handleTimeClick(slot.time)}
            disabled={isDisabled}
            className={`
              flex flex-col items-center px-4 py-3 rounded-lg border-2 transition-all duration-200 relative
              ${isSelected && !isDisabled
                ? 'border-primary-500 bg-primary-500 text-white' 
                : isDisabled
                ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'border-gray-200 bg-white text-gray-700 hover:border-primary-300 hover:bg-primary-50'
              }
            `}
          >
            {/* Time */}
            <span className="text-sm font-semibold">
              {slot.time}
            </span>
            
            {/* Status */}
            <span className={`
              text-xs mt-1 px-2 py-0.5 rounded-full
              ${slotStatus.status === 'sold-out' 
                ? 'bg-red-100 text-red-600' 
                : slotStatus.status === 'limited'
                ? 'bg-orange-100 text-orange-600'
                : isSelected
                ? 'bg-white bg-opacity-20 text-white'
                : 'bg-green-100 text-green-600'
              }
            `}>
              {slotStatus.text}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default TimeSlotSelector