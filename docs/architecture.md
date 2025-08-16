# 🏗️ Architecture Documentation

## System Overview

The Shipment Tracker is a full-stack web application built with a modern, scalable architecture. It follows the **MVC (Model-View-Controller)** pattern with clear separation of concerns between frontend and backend.

## High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (React)       │◄──►│  (Node.js)      │◄──►│   (MongoDB)     │
│                 │    │                 │    │                 │
│ • Components    │    │ • Controllers   │    │ • Collections   │
│ • Pages         │    │ • Routes        │    │ • Indexes       │
│ • Context       │    │ • Models        │    │ • Aggregations  │
│ • Utils         │    │ • Middleware    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   External      │
                    │   Services      │
                    │                 │
                    │ • Google Gemini │
                    │ • Vercel        │
                    └─────────────────┘
```

## Frontend Architecture

### Component Structure
```
src/
├── components/          # Reusable UI components
│   ├── Header.jsx      # Navigation header
│   ├── DashboardStats.jsx  # Statistics display
│   ├── ShipmentList.jsx    # Shipment grid/list
│   ├── ShipmentModal.jsx   # Create/edit shipment
│   ├── PackingInstructionsModal.jsx  # AI packing tips
│   └── QuickStatusUpdate.jsx  # Status change component
├── pages/              # Page-level components
│   ├── Dashboard.jsx   # Main dashboard page
│   ├── Login.jsx       # Authentication page
│   ├── Register.jsx    # User registration
│   └── Profile.jsx     # User profile management
├── context/            # React Context providers
│   └── AuthContext.jsx # Authentication state
└── utils/              # Utility functions
    └── api.js          # API client configuration
```

### State Management
- **React Context API** for global authentication state
- **Local State** with useState for component-specific data
- **Axios Interceptors** for automatic token management

### Routing
```javascript
App.jsx
├── / (Dashboard - Protected)
├── /login (Public)
├── /register (Public)
└── /profile (Protected)
```

## Backend Architecture

### Directory Structure
```
backend/
├── controllers/        # Business logic handlers
│   ├── userController.js     # User operations
│   └── shipmentController.js # Shipment operations
├── models/            # Database schemas
│   ├── userModel.js   # User data model
│   └── shipmentModel.js      # Shipment data model
├── routes/            # API route definitions
│   ├── userRoutes.js  # User-related endpoints
│   └── shipmentRoutes.js     # Shipment endpoints
├── middleware/        # Custom middleware
│   └── authMiddleware.js     # JWT verification
└── server.js          # Express server setup
```

### API Architecture
- **RESTful Design** - Standard HTTP methods and status codes
- **JWT Authentication** - Stateless token-based authentication
- **Middleware Chain** - CORS, Authentication, Error Handling
- **Route Protection** - Authentication required for sensitive endpoints

## Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,           // User's full name
  email: String,          // Unique email address
  password: String,       // Hashed password (bcrypt)
  role: String,           // USER, ADMIN (enum)
  createdAt: Date,        // Account creation timestamp
  updatedAt: Date         // Last modification timestamp
}
```

### Shipment Collection
```javascript
{
  _id: ObjectId,
  description: String,           // Item description
  status: String,               // PENDING, IN_TRANSIT, DELIVERED, CANCELLED
  is_fragile: Boolean,          // Fragile item flag
  origin: String,               // Pickup location
  destination: String,          // Delivery location
  distance_km: Number,          // Distance in kilometers
  shipping_method: String,      // STANDARD, EXPRESS
  estimated_delivery_days: Number,  // Estimated delivery time
  estimated_cost: Number,       // Shipping cost estimate
  tracking_number: String,      // Unique tracking identifier
  priority: String,             // LOW, NORMAL, HIGH, URGENT
  weight_kg: Number,            // Package weight
  notes: String,                // Additional notes
  actual_delivery_date: Date,   // Actual delivery timestamp
  user: ObjectId,               // Reference to User collection
  createdAt: Date,              // Creation timestamp
  updatedAt: Date               // Last update timestamp
}
```

### Database Indexes
```javascript
// User Collection Indexes
{ email: 1 }                    // Unique email lookup

// Shipment Collection Indexes
{ user: 1, createdAt: -1 }      // User shipments by date
{ tracking_number: 1 }          // Unique tracking lookup
{ status: 1 }                   // Status-based queries
{ user: 1, status: 1 }         // User status filtering
```

## API Endpoints

### Authentication Endpoints
```
POST /api/users/register    # User registration
POST /api/users/login       # User authentication
GET  /api/users/profile     # Get user profile (Protected)
PUT  /api/users/profile     # Update profile (Protected)
PUT  /api/users/password    # Change password (Protected)
```

### Shipment Endpoints
```
GET    /api/shipments           # List user shipments (Protected)
POST   /api/shipments           # Create new shipment (Protected)
GET    /api/shipments/stats     # Dashboard statistics (Protected)
GET    /api/shipments/:id       # Get shipment details (Protected)
PUT    /api/shipments/:id       # Update shipment (Protected)
PATCH  /api/shipments/:id/status # Quick status update (Protected)
DELETE /api/shipments/:id       # Delete shipment (Protected)
POST   /api/shipments/:id/packing-instructions # AI packing tips (Protected)
```

## Security Architecture

### Authentication Flow
1. User submits credentials
2. Server validates and generates JWT
3. Client stores token in localStorage
4. Token included in subsequent requests
5. Server verifies token on protected routes

### Security Measures
- **Password Hashing** - bcrypt with salt rounds
- **JWT Tokens** - Stateless authentication
- **CORS Configuration** - Cross-origin request control
- **Input Validation** - MongoDB schema validation
- **Environment Variables** - Sensitive data protection

## AI Integration Architecture

### Google Gemini Integration
```javascript
// AI Service Flow
User Request → Shipment Data → Prompt Generation → 
Gemini API → Response Processing → Formatted Display
```

### AI Features
- **Dynamic Prompts** - Context-aware instruction generation
- **Error Handling** - Graceful fallbacks for AI service issues
- **Response Formatting** - Beautiful rendering of AI content
- **Caching Strategy** - Future optimization opportunity

## Deployment Architecture

### Frontend Deployment (Vercel)
- **Static Site Generation** - Optimized build process
- **CDN Distribution** - Global content delivery
- **Environment Variables** - Runtime configuration
- **Automatic Deployments** - Git-based deployment triggers

### Backend Deployment (Vercel Serverless)
- **Serverless Functions** - Auto-scaling compute
- **Environment Variables** - Secure configuration
- **Global Edge Network** - Low-latency responses
- **Automatic SSL** - HTTPS encryption

### Database (MongoDB Atlas)
- **Replica Sets** - High availability
- **Auto-scaling** - Dynamic resource allocation
- **Backup & Recovery** - Automated data protection
- **Global Clusters** - Multi-region deployment

## Performance Considerations

### Frontend Optimizations
- **Code Splitting** - Lazy loading of components
- **Bundle Optimization** - Vite's efficient bundling
- **Caching Strategy** - Browser and CDN caching
- **Image Optimization** - Responsive image delivery

### Backend Optimizations
- **Database Indexing** - Query performance optimization
- **Connection Pooling** - Efficient database connections
- **Caching Headers** - HTTP response caching
- **Rate Limiting** - API abuse prevention

## Scalability Considerations

### Horizontal Scaling
- **Stateless Design** - Easy horizontal scaling
- **Database Sharding** - Future data partitioning
- **Microservices** - Service decomposition opportunity
- **Load Balancing** - Traffic distribution

### Monitoring & Analytics
- **Error Tracking** - Comprehensive error logging
- **Performance Monitoring** - Response time tracking
- **User Analytics** - Usage pattern analysis
- **Health Checks** - System status monitoring

---

*This architecture ensures scalability, maintainability, and performance while providing a solid foundation for future enhancements.*
