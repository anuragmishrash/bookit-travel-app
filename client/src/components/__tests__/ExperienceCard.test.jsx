import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import ExperienceCard from '../experience/ExperienceCard'

const mockExperience = {
  _id: '1',
  title: 'Test Experience',
  location: 'Test Location',
  price: 999,
  image: 'https://example.com/image.jpg',
  description: 'Test description',
  category: 'adventure',
  rating: 4.5,
  reviewCount: 100
}

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('ExperienceCard', () => {
  it('renders experience information correctly', () => {
    renderWithRouter(<ExperienceCard experience={mockExperience} />)
    
    expect(screen.getByText('Test Experience')).toBeInTheDocument()
    expect(screen.getByText('Test Location')).toBeInTheDocument()
    expect(screen.getByText('₹999')).toBeInTheDocument()
    expect(screen.getByText('Test description')).toBeInTheDocument()
    expect(screen.getByText('View Details')).toBeInTheDocument()
  })

  it('displays rating when available', () => {
    renderWithRouter(<ExperienceCard experience={mockExperience} />)
    
    expect(screen.getByText('4.5')).toBeInTheDocument()
    expect(screen.getByText('(100 reviews)')).toBeInTheDocument()
  })

  it('renders image with correct alt text', () => {
    renderWithRouter(<ExperienceCard experience={mockExperience} />)
    
    const image = screen.getByAltText('Test Experience')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg')
  })
})