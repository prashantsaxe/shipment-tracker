# 🔌 API Documentation

## Base URL
**Production:** `https://shipment-tracker-phi.vercel.app/api`
**Development:** `http://localhost:5000/api`

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Response Format
All API responses follow this standard format:
```json
{
  "success": true,
  "data": {...},
  "message": "Success message"
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

---

## 👤 User Authentication

### Register User
**POST** `/users/register`

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "USER"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "64a1b2c3d4e5f6789abcdef0",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Validation Rules:**
- `name`: Required, 2-50 characters
- `email`: Required, valid email format, unique
- `password`: Required, minimum 6 characters
- `role`: Optional, defaults to "USER"

---

### Login User
**POST** `/users/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "_id": "64a1b2c3d4e5f6789abcdef0",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Get User Profile
**GET** `/users/profile`
🔒 **Protected Route**

Get current user's profile information.

**Response (200):**
```json
{
  "user": {
    "_id": "64a1b2c3d4e5f6789abcdef0",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### Update User Profile
**PUT** `/users/profile`
🔒 **Protected Route**

Update user profile information.

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com"
}
```

**Response (200):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "_id": "64a1b2c3d4e5f6789abcdef0",
    "name": "John Smith",
    "email": "johnsmith@example.com",
    "role": "USER"
  }
}
```

---

### Update Password
**PUT** `/users/password`
🔒 **Protected Route**

Change user password.

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword456"
}
```

**Response (200):**
```json
{
  "message": "Password updated successfully"
}
```

---

## 📦 Shipment Management

### Get All Shipments
**GET** `/shipments`
🔒 **Protected Route**

Retrieve all shipments for the authenticated user.

**Query Parameters:**
- `status` (optional): Filter by status (PENDING, IN_TRANSIT, DELIVERED, CANCELLED)
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 10)

**Example Request:**
```
GET /shipments?status=IN_TRANSIT&page=1&limit=5
```

**Response (200):**
```json
{
  "shipments": [
    {
      "_id": "64a1b2c3d4e5f6789abcdef1",
      "description": "MacBook Pro 16-inch",
      "status": "IN_TRANSIT",
      "is_fragile": true,
      "origin": "Mumbai",
      "destination": "Delhi",
      "distance_km": 1200,
      "shipping_method": "EXPRESS",
      "estimated_delivery_days": 2,
      "estimated_cost": 850,
      "tracking_number": "ST123456789",
      "priority": "HIGH",
      "weight_kg": 2.5,
      "notes": "Handle with care",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T14:20:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalShipments": 15,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

### Create Shipment
**POST** `/shipments`
🔒 **Protected Route**

Create a new shipment.

**Request Body:**
```json
{
  "description": "MacBook Pro 16-inch",
  "is_fragile": true,
  "origin": "Mumbai",
  "destination": "Delhi",
  "distance_km": 1200,
  "shipping_method": "EXPRESS",
  "weight_kg": 2.5,
  "priority": "HIGH",
  "notes": "Handle with care"
}
```

**Response (201):**
```json
{
  "message": "Shipment created successfully",
  "shipment": {
    "_id": "64a1b2c3d4e5f6789abcdef1",
    "description": "MacBook Pro 16-inch",
    "status": "PENDING",
    "is_fragile": true,
    "origin": "Mumbai",
    "destination": "Delhi",
    "distance_km": 1200,
    "shipping_method": "EXPRESS",
    "estimated_delivery_days": 2,
    "estimated_cost": 850,
    "tracking_number": "ST123456789",
    "priority": "HIGH",
    "weight_kg": 2.5,
    "notes": "Handle with care",
    "user": "64a1b2c3d4e5f6789abcdef0",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Validation Rules:**
- `description`: Required, max 500 characters
- `origin`: Required, string
- `destination`: Required, string
- `distance_km`: Required, minimum 1
- `shipping_method`: Optional, enum ["STANDARD", "EXPRESS"]
- `weight_kg`: Optional, minimum 0.1, default 1
- `priority`: Optional, enum ["LOW", "NORMAL", "HIGH", "URGENT"]

---

### Get Single Shipment
**GET** `/shipments/:id`
🔒 **Protected Route**

Get details of a specific shipment.

**Response (200):**
```json
{
  "shipment": {
    "_id": "64a1b2c3d4e5f6789abcdef1",
    "description": "MacBook Pro 16-inch",
    "status": "IN_TRANSIT",
    "is_fragile": true,
    "origin": "Mumbai",
    "destination": "Delhi",
    "distance_km": 1200,
    "shipping_method": "EXPRESS",
    "estimated_delivery_days": 2,
    "estimated_cost": 850,
    "tracking_number": "ST123456789",
    "priority": "HIGH",
    "weight_kg": 2.5,
    "notes": "Handle with care",
    "user": "64a1b2c3d4e5f6789abcdef0",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T14:20:00.000Z"
  }
}
```

---

### Update Shipment
**PUT** `/shipments/:id`
🔒 **Protected Route**

Update an existing shipment (only editable fields).

**Request Body:**
```json
{
  "description": "MacBook Pro 16-inch (Updated)",
  "notes": "Updated handling instructions",
  "priority": "URGENT"
}
```

**Response (200):**
```json
{
  "message": "Shipment updated successfully",
  "shipment": {
    "_id": "64a1b2c3d4e5f6789abcdef1",
    "description": "MacBook Pro 16-inch (Updated)",
    "notes": "Updated handling instructions",
    "priority": "URGENT",
    "updatedAt": "2024-01-15T16:45:00.000Z"
  }
}
```

---

### Update Shipment Status
**PATCH** `/shipments/:id/status`
🔒 **Protected Route**

Quick status update for a shipment.

**Request Body:**
```json
{
  "status": "DELIVERED",
  "actual_delivery_date": "2024-01-17T09:30:00.000Z"
}
```

**Response (200):**
```json
{
  "message": "Shipment status updated successfully",
  "shipment": {
    "_id": "64a1b2c3d4e5f6789abcdef1",
    "status": "DELIVERED",
    "actual_delivery_date": "2024-01-17T09:30:00.000Z",
    "updatedAt": "2024-01-17T09:30:00.000Z"
  }
}
```

**Valid Status Values:**
- `PENDING` - Initial status
- `IN_TRANSIT` - Package is in transit
- `DELIVERED` - Package delivered successfully
- `CANCELLED` - Shipment cancelled

---

### Delete Shipment
**DELETE** `/shipments/:id`
🔒 **Protected Route**

Delete a shipment (only for shipment owner).

**Response (200):**
```json
{
  "message": "Shipment removed successfully"
}
```

---

### Get Dashboard Statistics
**GET** `/shipments/stats`
🔒 **Protected Route**

Get dashboard statistics for the authenticated user.

**Response (200):**
```json
{
  "stats": {
    "totalShipments": 25,
    "pendingShipments": 8,
    "inTransitShipments": 12,
    "deliveredShipments": 4,
    "cancelledShipments": 1,
    "totalValue": 15750.50,
    "averageDeliveryTime": 3.2,
    "recentShipments": [
      {
        "_id": "64a1b2c3d4e5f6789abcdef1",
        "description": "MacBook Pro 16-inch",
        "status": "IN_TRANSIT",
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
}
```

---

## 🤖 AI Packing Instructions

### Get AI Packing Instructions
**POST** `/shipments/:id/packing-instructions`
🔒 **Protected Route**

Generate AI-powered packing instructions for a specific shipment.

**Response (200):**
```json
{
  "instructions": "## Materials Needed\n• Anti-static bubble wrap\n• Laptop-specific shipping box\n• Corner protectors\n\n## Packing Steps\n1. Power down and disconnect all cables\n2. Wrap in anti-static bubble wrap\n3. Place in original box if available\n\n## Special Considerations\n• Keep away from magnetic fields\n• Avoid extreme temperatures\n\n## Final Checks\n• Box is properly sealed\n• Fragile labels are visible",
  "shipment": {
    "id": "64a1b2c3d4e5f6789abcdef1",
    "description": "MacBook Pro 16-inch",
    "is_fragile": true,
    "shipping_method": "EXPRESS"
  }
}
```

**Error Response (500):**
```json
{
  "message": "Error generating packing instructions",
  "error": "AI service temporarily unavailable"
}
```

---

## 📊 HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid request data |
| 401 | Unauthorized - Authentication required or invalid |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

---

## 🔧 Error Handling

### Validation Errors (400)
```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters"
    }
  ]
}
```

### Authentication Errors (401)
```json
{
  "message": "Access denied. No token provided."
}
```

### Authorization Errors (403)
```json
{
  "message": "Not authorized to access this resource"
}
```

### Not Found Errors (404)
```json
{
  "message": "Shipment not found"
}
```

---

## 📝 Example Usage with cURL

### Register and Login
```bash
# Register
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Create and Manage Shipments
```bash
# Create shipment (use token from login response)
curl -X POST http://localhost:5000/api/shipments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"description":"MacBook Pro","origin":"Mumbai","destination":"Delhi","distance_km":1200,"is_fragile":true}'

# Get all shipments
curl -X GET http://localhost:5000/api/shipments \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Update shipment status
curl -X PATCH http://localhost:5000/api/shipments/SHIPMENT_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"status":"IN_TRANSIT"}'
```

---

## 🚀 Rate Limiting

- **Authentication endpoints**: 5 requests per minute per IP
- **General API endpoints**: 100 requests per minute per user
- **AI endpoints**: 10 requests per minute per user

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642680000
```

---

*This API documentation provides comprehensive guidance for integrating with the Shipment Tracker backend services.*
