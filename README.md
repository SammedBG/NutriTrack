# Gym Nutrition Tracker (MERN) — Local Setup

Two apps: server (Express + MongoDB) and client (React + Vite).

## Prereqs
- Node.js 18+ and npm
- MongoDB Atlas or local MongoDB
- Optional: Cloudinary or S3 for image storage

## Server
1. cd server
2. cp .env.example .env and edit MONGO_URI & JWT_SECRET & CORS_ORIGIN
3. npm install
4. npm run dev
   - server runs on http://localhost:4000

## Client
1. cd client
2. cp .env.example .env
3. npm install
4. npm run dev
   - client runs on http://localhost:3000

## Flow
- Register a user via /register
- Login — server sets httpOnly cookie token
- Visit Profile to set goals
- Visit Meals to add (photo), client will create meal metadata and call ingest to get ML stub results

## Next steps to make production-ready
- Replace storage stub (`server/src/services/storage.js`) with Cloudinary or S3 presigned URLs
- Implement direct image upload POST route (multipart) if you prefer client to upload to backend
- Replace ML stub (`server/src/services/ml.js`) with real classifier + nutrition DB lookup (Nutritionix / USDA)
- Add email verification & forgot password
- Add metrics, Sentry, proper logging
- Use HTTPS and secure cookies in production
