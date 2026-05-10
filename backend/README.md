# Traveloop Backend API

Node.js + Express API for Traveloop Smart Travel Planner with MongoDB database.

## Prerequisites

- Node.js (v14+)
- npm or yarn
- MongoDB (local or cloud)

## Installation

1. **Navigate to backend folder:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create .env file:**
```bash
cp .env.example .env
```

4. **Update .env with your settings:**
```
MONGODB_URI=mongodb://localhost:27017/traveloop
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:3000
PORT=5000
```

## MongoDB Setup

### Local MongoDB (Windows)

1. Install MongoDB Community Edition from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
```bash
# On Windows (PowerShell as Admin)
net start MongoDB

# Or use MongoDB Compass GUI
```

### Cloud MongoDB (Atlas)

1. Create account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create cluster and get connection string
3. Update MONGODB_URI in .env:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/traveloop
```

## Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

Server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password

### Trips
- `GET /api/trips` - Get user's trips
- `POST /api/trips` - Create trip
- `GET /api/trips/:id` - Get trip details
- `PUT /api/trips/:id` - Update trip
- `DELETE /api/trips/:id` - Delete trip
- `PUT /api/trips/:id/make-public` - Make trip public
- `PUT /api/trips/:id/budget` - Update trip budget

### Destinations
- `POST /api/trips/:tripId/destinations` - Add destination
- `GET /api/trips/:tripId/destinations` - Get destinations
- `PUT /api/destinations/:destId` - Update destination
- `DELETE /api/destinations/:destId` - Delete destination

### Activities
- `POST /api/destinations/:destId/activities` - Add activity
- `GET /api/destinations/:destId/activities` - Get activities
- `PUT /api/activities/:actId` - Update activity
- `DELETE /api/activities/:actId` - Delete activity

### Packing
- `POST /api/trips/:tripId/packing` - Add packing item
- `GET /api/trips/:tripId/packing` - Get packing items
- `PUT /api/packing/:itemId` - Update packing item
- `DELETE /api/packing/:itemId` - Delete packing item
- `PUT /api/packing/:itemId/toggle` - Toggle packed status

### Notes
- `POST /api/trips/:tripId/notes` - Add note
- `GET /api/trips/:tripId/notes` - Get notes
- `PUT /api/notes/:noteId` - Update note
- `DELETE /api/notes/:noteId` - Delete note

### Reviews
- `POST /api/reviews/:tripId` - Add review (user must be logged in)
- `GET /api/reviews/:tripId` - Get reviews (public)
- `PUT /api/reviews/:reviewId` - Update review
- `DELETE /api/reviews/:reviewId` - Delete review

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/preferences` - Update preferences
- `POST /api/users/change-password` - Change password
- `DELETE /api/users/account` - Delete account

## Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### How to authenticate requests:

1. Login and get token:
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

2. Use token in protected requests:
```bash
GET /api/trips
Authorization: Bearer your_token_here
```

## Project Structure

```
backend/
├── config/
│   └── db.js                 # Database connection
├── models/
│   ├── User.js              # User schema
│   ├── Trip.js              # Trip schema
│   ├── Destination.js       # Destination schema
│   ├── Activity.js          # Activity schema
│   ├── PackingItem.js       # Packing item schema
│   ├── Note.js              # Note schema
│   └── Review.js            # Review schema
├── controllers/
│   ├── authController.js    # Auth logic
│   ├── tripController.js    # Trip logic
│   ├── destinationController.js
│   ├── activityController.js
│   ├── packingController.js
│   ├── noteController.js
│   ├── reviewController.js
│   └── userController.js
├── routes/
│   ├── auth.js              # Auth routes
│   ├── trips.js             # Trip routes
│   ├── destinations.js      # Destination routes
│   ├── activities.js        # Activity routes
│   ├── packing.js           # Packing routes
│   ├── notes.js             # Notes routes
│   ├── reviews.js           # Reviews routes
│   └── users.js             # User routes
├── middleware/
│   ├── auth.js              # JWT verification
│   └── errorHandler.js      # Error handling
├── .env                     # Environment variables
├── .env.example             # Example env
├── server.js               # Main server file
└── package.json             # Dependencies
```

## Database Schema

### Users
- name, email, password (hashed)
- profilePhoto, bio
- savedDestinations
- preferences (language, currency)
- role (user/admin)

### Trips
- user (reference)
- name, description, coverPhoto
- startDate, endDate
- status, budget, actualSpent
- groupMembers (for group trips)
- isPublic, publicUrl
- destinations, tags

### Destinations
- trip (reference)
- name, country, description
- startDate, endDate
- costIndex, popularity
- activities (reference)
- photo, order

### Activities
- destination (reference)
- name, date, time, duration
- category, description, cost
- location, photos, rating

### Packing Items
- trip (reference)
- name, category, quantity
- isPacked, priority, notes

### Notes
- trip (reference)
- destination (optional reference)
- title, content, category
- isPinned, tags, photos

### Reviews
- trip (reference)
- author (user reference)
- rating, title, comment
- helpful count, status

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

## Conventions

- All dates are stored as ISO strings
- Costs/budgets in default currency (USD)
- Passwords are bcrypt hashed
- JWT tokens expire in 30 days
- All timestamps are UTC

## Future Enhancements

- Image upload/storage (S3)
- Email notifications
- Real-time collaboration (WebSockets)
- Group trip invitations
- Expense splitting
- Integration with payment services
- Admin dashboard
- Analytics

## Support

For issues or questions, refer to the main README.md

