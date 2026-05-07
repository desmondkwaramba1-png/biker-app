# MotoDeliver — Zimbabwe Biker Delivery App

A full-stack mobile delivery app for Zimbabwe, where customers post delivery requests and bikers on motorcycles fulfil them.

## Stack

| Layer | Technology |
|---|---|
| Frontend | React Native (Expo) |
| Backend | Node.js + Express |
| Database | MongoDB (Mongoose) |
| Auth | Firebase Phone Auth (OTP) |
| Real-time | Socket.io (live biker tracking) |
| Maps | react-native-maps + expo-location |

## Project Structure

```
.
├── frontend/        # Expo React Native app
└── backend/         # Node.js + Express API
```

## Getting Started

### Backend

```bash
cd backend
cp .env.example .env      # fill in your values
npm install
npm run dev               # starts on port 5000
```

### Frontend

```bash
cd frontend
npm install
npx expo start            # scan QR with Expo Go app
```

## App Flow

### Customer
1. Sign in with Zimbabwe phone number (+263) via OTP
2. Post a delivery — pickup address, drop-off address, package description, price offer (USD)
3. Bikers see the request and accept it
4. Customer tracks the biker live on a map
5. Rate the biker after delivery

### Biker
1. Sign in and enable **Biker Mode** in Profile
2. Submit documents for verification (national ID + licence)
3. Toggle online to see available delivery requests
4. Accept a request → pick up → mark delivered
5. Earnings tracked in USD

## Environment Variables

See `backend/.env.example` for required values:
- `MONGODB_URI` — MongoDB Atlas connection string
- `JWT_SECRET` — any long random string
- Firebase Admin SDK credentials (from Firebase Console → Service Accounts)

Update `frontend/src/services/firebase.js` with your Firebase web app config.
Update `frontend/src/utils/constants.js` with your backend URL when deploying.
