# Secure School Shield - Server

## Setup

1. Create a `.env` file in this `server/` directory with:

```
MONGO_URI=mongodb://127.0.0.1:27017/secure_school_shield
PORT=4000
JWT_SECRET=change_me
CORS_ORIGIN=http://localhost:5173
```

2. Install dependencies and run the dev server:

```
npm install
npm run dev
```

API served on `http://localhost:4000`.

## Routes
- POST `/api/auth/signup`
- POST `/api/auth/signin`
- GET `/api/alerts`, POST `/api/alerts`
- GET `/api/drills`, POST `/api/drills`

