import ExperienceCard from './ExperienceCard'

const ExperienceGrid = ({ experiences }) => {
  if (!experiences || experiences.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No experiences available
        </h3>
        <p className="text-gray-600">
          Check back later for new experiences.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {experiences.map((experience) => (
        <ExperienceCard 
          key={experience._id} 
          experience={experience} 
        />
      ))}
    </div>
  )
}

export default ExperienceGrid