# Project Structure

```
bookit-travel-app/
├── client/                     # React Frontend
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   │   ├── booking/        # Booking-related components
│   │   │   ├── common/         # Shared components
│   │   │   ├── experience/     # Experience-related components
│   │   │   └── layout/         # Layout components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── pages/              # Page components
│   │   ├── services/           # API service functions
│   │   ├── utils/              # Utility functions
│   │   ├── App.jsx             # Main App component
│   │   ├── index.css           # Global styles
│   │   └── main.jsx            # React entry point
│   ├── .env.example            # Environment variables template
│   ├── .env.production         # Production environment config
│   ├── index.html              # HTML template
│   ├── package.json            # Frontend dependencies
│   ├── tailwind.config.js      # TailwindCSS configuration
│   ├── vercel.json             # Vercel deployment config
│   └── vite.config.js          # Vite build configuration
│
├── server/                     # Node.js Backend
│   ├── controllers/            # Route controllers
│   │   ├── bookingController.js
│   │   ├── experienceController.js
│   │   └── promoController.js
│   ├── middleware/             # Express middleware
│   │   ├── errorHandler.js
│   │   └── validation.js
│   ├── models/                 # Mongoose data models
│   │   ├── Booking.js
│   │   ├── Experience.js
│   │   └── PromoCode.js
│   ├── routes/                 # API route definitions
│   │   ├── admin.js
│   │   ├── bookings.js
│   │   ├── experiences.js
│   │   └── promo.js
│   ├── utils/                  # Utility functions
│   │   ├── database.js
│   │   └── seedDatabase.js
│   ├── .env.example            # Environment variables template
│   ├── .env.production         # Production environment config
│   ├── Dockerfile              # Docker configuration
│   ├── package.json            # Backend dependencies
│   ├── render.yaml             # Render deployment config
│   └── server.js               # Express server entry point
│
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions CI/CD
├── .gitignore                  # Git ignore rules
├── DEPLOYMENT.md               # Deployment instructions
├── LICENSE                     # MIT License
├── package.json                # Root package.json for scripts
├── PROJECT_STRUCTURE.md        # This file
└── README.md                   # Main documentation
```

## Key Files Explained

### Frontend (client/)

- **src/components/**: Organized by feature (booking, experience, common, layout)
- **src/pages/**: Main page components (Home, Details, Checkout, Confirmation)
- **src/services/api.js**: Centralized API communication with axios
- **src/utils/helpers.js**: Utility functions for formatting, validation, etc.
- **tailwind.config.js**: Custom TailwindCSS configuration with Highway Delite colors
- **vite.config.js**: Vite configuration with proxy for development

### Backend (server/)

- **controllers/**: Business logic for handling requests
- **models/**: Mongoose schemas for MongoDB collections
- **routes/**: Express route definitions with validation
- **middleware/**: Custom middleware for error handling and validation
- **utils/seedDatabase.js**: Database seeding with sample data
- **server.js**: Main Express application setup

### Configuration Files

- **.env.example**: Template for environment variables
- **vercel.json**: Vercel deployment configuration for SPA routing
- **render.yaml**: Render deployment configuration
- **Dockerfile**: Container configuration for deployment
- **.github/workflows/deploy.yml**: CI/CD pipeline configuration

## Development Workflow

1. **Local Development**: Use `npm run dev` from root to start both servers
2. **Testing**: Run `npm test` in client/ and server/ directories
3. **Building**: Use `npm run build` in client/ for production build
4. **Deployment**: Push to main branch triggers GitHub Actions

## Environment Variables

### Required for Development
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `VITE_API_URL`: Frontend API endpoint

### Required for Production
- All development variables plus:
- `NODE_ENV=production`
- `CORS_ORIGIN`: Frontend URL for CORS
- `PORT`: Server port (usually set by hosting platform)

## API Endpoints

### Experiences
- `GET /api/experiences` - List experiences
- `GET /api/experiences/:id` - Get experience details

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/:id` - Get booking details

### Promo Codes
- `POST /api/promo/validate` - Validate promo code

### Admin
- `POST /api/admin/seed` - Seed database (production)

## Database Collections

### experiences
- Experience details, pricing, availability slots
- Indexed on category, location, price

### bookings
- Customer bookings with unique IDs
- Indexed on bookingId, experienceId, customer email

### promocodes
- Discount codes with usage tracking
- Indexed on code, active status

## Deployment Platforms

### Recommended Stack
- **Frontend**: Vercel (automatic deployments, global CDN)
- **Backend**: Render (free tier, automatic deployments)
- **Database**: MongoDB Atlas (free tier, managed service)

### Alternative Options
- **Railway**: Full-stack deployment
- **Netlify**: Frontend alternative to Vercel
- **Heroku**: Backend alternative (paid)
- **DigitalOcean**: VPS deployment option