# Park & Ride Backend

This is the backend server for the Park & Ride application.

## Prerequisites

- Node.js (v14 or higher)
- Docker and Docker Compose (for local MongoDB)
- TypeScript

## Setup

1. Clone the repository
2. Navigate to the backend directory: `cd park-and-ride/backend`
3. Install dependencies: `npm install`
4. Copy `.env.example` to `.env` and update environment variables
5. Start MongoDB using Docker: `npm run db:start`
6. Test MongoDB connection: `npm run db:test-connection`
7. Seed the database with sample data: `npm run db:seed`
8. Build the application: `npm run build`
9. Start the server: `npm start`

## Development

To start the server in development mode with auto-reload:

```bash
npm run dev
```

## Docker MongoDB Setup

The project includes a Docker Compose configuration to easily run MongoDB:

```bash
# Start MongoDB and Mongo Express
npm run db:start

# Stop MongoDB and Mongo Express
npm run db:stop

# Restart MongoDB and Mongo Express
npm run db:restart

# View MongoDB logs
npm run db:logs
```

Access MongoDB admin interface at http://localhost:8081 with credentials:
- Username: `admin`
- Password: `password`

## Database Setup and Management

The backend includes several utilities for MongoDB database management:

### 1. Test MongoDB Connection

Check if MongoDB is running and properly connected:

```bash
npm run db:test-connection
```

### 2. Database Check

Check the MongoDB connection and get stats on the collections:

```bash
npm run db:check
```

This command will display:
- MongoDB connection status
- Database name and server
- Document counts in each collection
- Sample data from collections

### 3. Database Seeding

Populate the database with sample data for development:

```bash
npm run db:seed
```

This will:
- Clear existing data (be careful in production!)
- Create sample users with hashed passwords
- Create sample parking facilities with amenities, rates, etc.
- Create sample rides with coordinates and stops
- Create sample parking bookings
- Create sample payments linked to bookings and rides

### 4. Database Manager

Interactive utility for database operations:

```bash
npm run db:manager
```

Features:
- Show database status
- Count documents in collections
- Clear all data or specific collections
- Add sample users
- List all users or parking facilities

### 5. Database Backup

Create a backup of the MongoDB database:

```bash
npm run db:backup
```

Backups are stored in the `backups` directory as gzipped archives with timestamps.

### 6. Database Restore

Restore the database from a previous backup:

```bash
npm run db:restore
```

This will:
- List available backups with timestamps
- Let you select a backup to restore
- Restore the database from the selected backup

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection URI | mongodb://localhost:27017/park-and-ride |
| JWT_SECRET | Secret key for JWT | park-and-ride-secret-key-2023 |
| NODE_ENV | Environment (development/production) | development |
| CLIENT_URL | Client application URL | http://localhost:3000 |

## API Routes

The API is organized into the following route groups:

- `/api/auth`: Authentication and user account management
- `/api/users`: User profile management
- `/api/parking`: Parking facilities and bookings
- `/api/rides`: Ride services and bookings
- `/api/payments`: Payment processing and history

Health check endpoint:
- `/health`: Check server status

## License

This project is licensed under the ISC License. 