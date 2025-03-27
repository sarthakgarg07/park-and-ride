# Park and Ride Application

A modern web application that helps users find and book parking spots, as well as arrange rides to and from their destinations. Built with Next.js, TypeScript, and MongoDB.

## Features

- 🚗 **Parking Management**
  - Find available parking spots
  - Book parking spaces in advance
  - Real-time parking spot availability
  - Interactive parking map interface

- 🚕 **Ride Booking**
  - Book rides to and from parking locations
  - Real-time ride tracking
  - Multiple ride options
  - Secure payment integration

- 👤 **User Features**
  - User authentication and authorization
  - Personal dashboard
  - Booking history
  - Profile management

- 💳 **Payment Integration**
  - Secure payment processing
  - Multiple payment methods
  - Transaction history

## Tech Stack

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- React Icons
- Map Integration

### Backend
- Node.js
- Express
- TypeScript
- MongoDB
- JWT Authentication

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/sarthakgarg07/park-and-ride.git
   cd park-and-ride
   ```

2. Install dependencies:
   ```bash
   # Install frontend dependencies
   cd park-and-ride
   npm install

   # Install backend dependencies
   cd backend
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the backend directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. Start the development servers:
   ```bash
   # Start backend server
   cd backend
   npm run dev

   # Start frontend server (in a new terminal)
   cd park-and-ride
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
park-and-ride/
├── park-and-ride/          # Frontend Next.js application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/        # Next.js pages
│   │   ├── services/     # API services
│   │   └── styles/       # Global styles
│   └── public/           # Static assets
├── backend/               # Backend Node.js application
│   ├── src/
│   │   ├── controllers/  # Route controllers
│   │   ├── models/       # MongoDB models
│   │   ├── routes/       # API routes
│   │   └── utils/        # Utility functions
│   └── config/           # Configuration files
└── README.md
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- POST `/api/auth/logout` - Logout user

### Parking
- GET `/api/parking` - Get all parking spots
- GET `/api/parking/:id` - Get specific parking spot
- POST `/api/parking/book` - Book a parking spot
- GET `/api/parking/bookings` - Get user's parking bookings

### Rides
- POST `/api/rides/book` - Book a ride
- GET `/api/rides/track/:id` - Track ride status
- GET `/api/rides/history` - Get ride history

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Contact

Sarthak Garg - [GitHub](https://github.com/sarthakgarg07)

Project Link: [https://github.com/sarthakgarg07/park-and-ride](https://github.com/sarthakgarg07/park-and-ride)
