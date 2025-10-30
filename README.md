# BookIt: Travel Experiences & Slots

A complete end-to-end travel booking web application built with React frontend and Node.js backend. Users can explore travel experiences, select available slots, and complete bookings with a seamless user experience matching the provided Figma designs exactly.

## 🚀 Features

- **Experience Discovery**: Browse and search travel experiences with filtering
- **Slot Selection**: Choose from available dates and time slots with real-time availability
- **Smart Booking System**: Prevents double-booking and manages capacity automatically
- **Promo Codes**: Apply discount codes (SAVE10, FLAT100, WELCOME20) with validation
- **Responsive Design**: Mobile-friendly interface matching Figma designs pixel-perfect
- **Complete Booking Flow**: From browsing to confirmation with error handling
- **Real-time Updates**: Live slot availability and pricing calculations
- **Form Validation**: Comprehensive client and server-side validation

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **TailwindCSS** for utility-first styling
- **React Router** for client-side routing
- **Axios** for HTTP requests with interceptors
- **React Hook Form** for efficient form management
- **Lucide React** for consistent icons

### Backend
- **Node.js** with Express framework
- **MongoDB Atlas** for cloud database
- **Mongoose** for elegant MongoDB object modeling
- **Express Validator** for request validation
- **CORS** for cross-origin resource sharing
- **dotenv** for environment configuration

### Database Schema
- **Experiences**: Complete experience data with slot management
- **Bookings**: Customer bookings with unique ID generation
- **Promo Codes**: Flexible discount system with usage tracking

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account (connection string provided)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/anuragmishrash/bookit-travel-app.git
   cd bookit-travel-app
   npm run install-deps
   ```

2. **Environment Setup**
   ```bash
   # Backend environment
   cd server
   cp .env.example .env
   # Edit .env with your MongoDB URI and other settings
   
   # Frontend environment
   cd ../client
   cp .env.example .env
   # Edit .env with your API URL
   ```

3. **Database Setup**
   ```bash
   cd server
   npm run seed  # Seeds the database with sample data
   ```

4. **Start Development Servers**
   ```bash
   # From root directory - starts both frontend and backend
   npm run dev
   
   # Or start individually:
   npm run server  # Backend on http://localhost:5000
   npm run client  # Frontend on http://localhost:3000
   ```

5. **Access Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api
   - Health Check: http://localhost:5000/api/health

## 🌐 API Documentation

### Experiences
- `GET /api/experiences` - List all experiences with pagination and filtering
- `GET /api/experiences/:id` - Get specific experience with available slots
- `GET /api/experiences/:id/slots/:date` - Get available slots for specific date
- `GET /api/experiences/categories` - Get all experience categories
- `GET /api/experiences/locations` - Get all experience locations

### Bookings
- `POST /api/bookings` - Create new booking with validation
- `GET /api/bookings/:bookingId` - Get booking details
- `GET /api/bookings/customer/:email` - Get customer's bookings
- `PUT /api/bookings/:bookingId/cancel` - Cancel booking

### Promo Codes
- `POST /api/promo/validate` - Validate promo code and calculate discount
- `GET /api/promo/active` - Get all active promo codes
- `GET /api/promo/:code` - Get specific promo code details

### System
- `GET /api/health` - Health check endpoint

## 🎨 Design Implementation

The application matches the provided Figma designs exactly:

### Design Features
- **Highway Delite Branding**: Consistent logo and color scheme
- **Responsive Layouts**: Desktop and mobile breakpoints
- **Interactive States**: Hover, active, and disabled states
- **Loading States**: Spinners and skeleton screens
- **Error States**: User-friendly error messages
- **Success States**: Confirmation and feedback

### Color Palette
- Primary: Yellow/Gold (#f59e0b)
- Gray Scale: Various shades for text and backgrounds
- Success: Green for confirmations
- Error: Red for errors and warnings

## 📱 Application Flow

### User Journey
1. **Home Page**: Browse experiences with search and filtering
2. **Experience Details**: View details, select date and time slots
3. **Checkout**: Enter customer information and apply promo codes
4. **Confirmation**: View booking confirmation or error messages

### Key Features
- **Real-time Slot Management**: Prevents overbooking
- **Dynamic Pricing**: Automatic tax calculation and promo discounts
- **Form Validation**: Client and server-side validation
- **Error Handling**: Comprehensive error management
- **Mobile Responsive**: Works seamlessly on all devices

## 🧪 Testing

### Frontend Testing
```bash
cd client
npm test        # Run unit tests
npm run test:ui # Run tests with UI
```

### Backend Testing
```bash
cd server
npm test        # Run API tests
```

### Test Coverage
- Unit tests for utility functions
- Component tests for React components
- API endpoint tests
- Form validation tests

## 🚀 Deployment

### Live Demo
- **Frontend**: [https://bookit-travel-app.vercel.app](https://bookit-travel-app.vercel.app)
- **Backend API**: [https://bookit-api.onrender.com](https://bookit-api.onrender.com)

### Deploy Your Own

#### Frontend Deployment (Vercel)
1. Fork this repository
2. Connect your GitHub repository to Vercel
3. Set environment variables in Vercel dashboard:
   - `VITE_API_URL`: Your backend API URL
4. Deploy automatically on push to main branch

#### Backend Deployment (Render)
1. Connect your GitHub repository to Render
2. Set environment variables in Render dashboard:
   - `NODE_ENV`: production
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Your JWT secret key
   - `CORS_ORIGIN`: Your frontend URL
3. Deploy with automatic builds

#### Alternative: Railway Deployment
1. Connect repository to Railway
2. Set the same environment variables
3. Railway will auto-detect and deploy both services

### Environment Variables Required

#### Frontend
```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

#### Backend
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your_secure_jwt_secret
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

## 📊 Sample Data

The application includes sample data for:

### Experiences
- **Kayaking** (Udupi) - ₹999
- **Nandi Hills Sunrise** (Bangalore) - ₹899
- **Coffee Trail** (Coorg) - ₹1299
- **Boat Cruise** (Sunderbans) - ₹999
- **Bunjee Jumping** (Manali) - ₹999

### Promo Codes
- **SAVE10**: 10% discount on all bookings
- **FLAT100**: ₹100 off on bookings above ₹800
- **WELCOME20**: 20% off for first-time users

## 🔧 Development

### Project Structure
```
bookit-travel-booking/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API services
│   │   └── utils/         # Utility functions
├── server/                # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Express middleware
│   └── utils/            # Utility functions
└── README.md
```

### Key Technologies
- **Vite**: Fast build tool for React
- **TailwindCSS**: Utility-first CSS framework
- **Mongoose**: MongoDB object modeling
- **Express Validator**: Request validation
- **React Hook Form**: Performant form library

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Create Pull Request

## 🐛 Known Issues

- None currently reported

## 📞 Support

For support, email support@bookit.com or create an issue in the repository.

---

Built with ❤️ for seamless travel booking experiences | Matches Figma designs pixel-perfect