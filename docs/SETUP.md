# Smart Pasal - Setup Guide

## Prerequisites

### For Backend Development
- Node.js 18+ and npm
- Firebase account and project
- Text editor (VS Code recommended)

### For Mobile Development
- Node.js 18+ and npm
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your phone (for testing)
- Android Studio (for Android emulator)
- Xcode (for iOS simulator, Mac only)

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Firebase
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or use existing one
3. Enable Phone Authentication:
   - Go to Authentication > Sign-in method
   - Enable Phone provider
4. Create Firestore Database:
   - Go to Firestore Database
   - Create database in production mode
5. Generate Service Account Key:
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Download the JSON file

### 3. Setup Environment Variables
```bash
cp .env.example .env
```

Edit `.env` and add your Firebase credentials:
```
PORT=3000
NODE_ENV=development

# From your service account JSON file:
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com

ALLOWED_ORIGINS=http://localhost:19000,http://localhost:19001
```

### 4. Run the Backend
```bash
npm run dev
```

The API will start at `http://localhost:3000`

Test the health endpoint:
```bash
curl http://localhost:3000/health
```

## Mobile App Setup

### 1. Install Dependencies
```bash
cd mobile
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
```
API_BASE_URL=http://localhost:3000/api

# From Firebase Console > Project Settings > General > Your apps > Web app
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### 3. Run the App

Start Expo development server:
```bash
npm start
```

Then choose your platform:
- Press `a` to open in Android emulator
- Press `i` to open in iOS simulator (Mac only)
- Scan QR code with Expo Go app to test on physical device

## Development Workflow

### Backend Development
1. Make changes to files in `backend/src/`
2. Server auto-restarts with `ts-node-dev`
3. Test endpoints with Postman or curl

### Mobile Development
1. Make changes to files in `mobile/src/`
2. App hot-reloads automatically
3. Use React Native Debugger for debugging

## Database Schema

### Firestore Collections
- `shops`: Shop profiles
- `users`: User accounts
- `products`: Product inventory
- `sales`: Sales transactions
- `customers`: Customer information
- `suppliers`: Supplier information
- `udharTransactions`: Credit transactions
- `stockTransactions`: Stock movement history

### SQLite Tables (Mobile)
- Same structure as Firestore for offline functionality
- Uses local SQLite database for offline-first operation
- Syncs with Firestore when online

## Testing

### Backend Testing
```bash
cd backend
npm test
```

### Mobile Testing
```bash
cd mobile
npm test
```

## Building for Production

### Backend Deployment
1. Build the project:
```bash
cd backend
npm run build
```

2. Deploy to your hosting service:
   - Heroku: `git push heroku main`
   - DigitalOcean: Upload `dist` folder
   - AWS/Google Cloud: Follow their Node.js deployment guides

3. Set environment variables on the server

### Mobile App Deployment

#### Using Expo Application Services (EAS)
1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Login to Expo:
```bash
eas login
```

3. Configure EAS:
```bash
cd mobile
eas build:configure
```

4. Build for Android:
```bash
eas build --platform android
```

5. Build for iOS:
```bash
eas build --platform ios
```

6. Submit to stores:
```bash
eas submit --platform android
eas submit --platform ios
```

## Troubleshooting

### Backend Issues

**Problem**: Firebase credentials error
- **Solution**: Check that your service account JSON is correctly formatted
- Ensure private key has `\n` for newlines

**Problem**: CORS errors
- **Solution**: Add your frontend URL to `ALLOWED_ORIGINS` in `.env`

### Mobile Issues

**Problem**: "Unable to resolve module"
- **Solution**: Clear cache and reinstall:
```bash
rm -rf node_modules
npm install
expo start -c
```

**Problem**: SQLite errors
- **Solution**: Ensure you're using compatible Expo SDK version

**Problem**: Firebase auth not working
- **Solution**: Check Firebase configuration and enable Phone Authentication

### Common Issues

**Problem**: "Network request failed"
- **Solution**: 
  - Backend: Ensure API server is running
  - Mobile: Update API_BASE_URL in `.env`
  - Android emulator: Use `http://10.0.2.2:3000` instead of `localhost`
  - iOS simulator: Use `http://localhost:3000`

## Support

For issues or questions:
1. Check the documentation in `docs/` folder
2. Review API documentation at `docs/API.md`
3. Open an issue on GitHub

## Next Steps

1. Customize the app theme and branding
2. Add your shop logo and assets
3. Configure payment gateway credentials (eSewa, Khalti)
4. Test thoroughly on multiple devices
5. Deploy to production

---

Happy coding! 🚀
