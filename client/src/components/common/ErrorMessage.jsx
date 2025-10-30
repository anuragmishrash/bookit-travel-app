import { AlertCircle, RefreshCw } from 'lucide-react'

const ErrorMessage = ({ 
  message, 
  onRetry, 
  retryText = 'Try Again',
  className = '' 
}) => {
  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-6 ${className}`}>
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-800 mb-2">
            Something went wrong
          </h3>
          <p className="text-sm text-red-700 mb-4">
            {message}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {retryText}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ErrorMessage