# Database Setup Guide

This document provides instructions for setting up the MongoDB database for the Secure School Shield application.

## Prerequisites

1. MongoDB installed locally or access to a MongoDB Atlas cluster
2. Node.js and npm installed
3. All server dependencies installed (`cd server && npm install`)

## Local MongoDB Setup

### Option 1: Using MongoDB Atlas (Recommended for Development)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a free account if you don't have one
2. Create a new project and a free shared cluster
3. Add your current IP address to the IP Access List
4. Create a database user with read/write access
5. Get your connection string (it will look like `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/`)

### Option 2: Local MongoDB Installation

1. Download and install [MongoDB Community Server](https://www.mongodb.com/try/download/community)
2. Start the MongoDB service
3. The default connection string is `mongodb://127.0.0.1:27017/secure_school_shield`

## Environment Configuration

1. Create a `.env` file in the `server` directory if it doesn't exist
2. Add the following environment variables:

```env
# MongoDB connection string (update with your credentials)
MONGO_URI=mongodb://127.0.0.1:27017/secure_school_shield

# Server configuration
PORT=4000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=30d

# CORS Configuration (comma-separated list of allowed origins)
CORS_ORIGIN=http://localhost:5173
```

## Database Initialization

1. Install server dependencies (if not already installed):
   ```bash
   cd server
   npm install
   ```

2. Start the server in development mode (this will automatically connect to the database):
   ```bash
   npm run dev
   ```

3. (Optional) Seed the database with initial data:
   ```bash
   npm run seed
   ```

## Database Models

The application uses the following MongoDB collections:

- `users` - Stores all user accounts (students, teachers, admins)
- `alerts` - Emergency alerts and notifications
- `drills` - Emergency drill records
- `schools` - School information
- `classrooms` - Classroom details

## Backup and Restore

### Create a backup:
```bash
mongodump --uri="your_connection_string" --out=./backup-$(date +%Y%m%d)
```

### Restore from backup:
```bash
mongorestore --uri="your_connection_string" ./path/to/backup
```

## Troubleshooting

- **Connection Issues**: Ensure MongoDB is running and the connection string is correct
- **Authentication Errors**: Verify database credentials and user permissions
- **Port Conflicts**: Check if port 27017 (default MongoDB port) is available

For production deployment, ensure you:
1. Use a strong JWT secret
2. Enable proper authentication in MongoDB
3. Set appropriate CORS policies
4. Configure proper backup strategies
