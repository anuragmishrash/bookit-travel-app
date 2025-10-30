import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Search, ArrowLeft } from 'lucide-react'

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleBack = () => {
    navigate(-1)
  }

  const isHomePage = location.pathname === '/'
  const isDetailsPage = location.pathname.startsWith('/experience/')
  const isCheckoutPage = location.pathname === '/checkout'

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo or Back button */}
          <div className="flex items-center">
            {!isHomePage ? (
              <button
                onClick={handleBack}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                {isDetailsPage && 'Details'}
                {isCheckoutPage && 'Checkout'}
              </button>
            ) : null}
            
            <Link to="/" className="flex items-center">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center mr-2">
                  <span className="text-white text-sm font-bold">HD</span>
                </div>
                <div className="text-black font-semibold">
                  <span className="text-sm">highway</span>
                  <br />
                  <span className="text-xs -mt-1 block">delite</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Center - Search (only on home page) */}
          {isHomePage && (
            <div className="flex-1 max-w-lg mx-8">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search experiences"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-500 text-white px-4 py-1 rounded-md hover:bg-primary-600 transition-colors"
                >
                  Search
                </button>
              </form>
            </div>
          )}

          {/* Right side - Search button for non-home pages */}
          {!isHomePage && (
            <button
              onClick={() => navigate('/')}
              className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center"
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header