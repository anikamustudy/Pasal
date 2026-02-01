# Deployment Guide - Smart Pasal

This guide covers deployment of Smart Pasal to production environments.

## Prerequisites

- Firebase project configured
- Domain name (optional but recommended)
- Backend hosting service account (Heroku, DigitalOcean, AWS, etc.)
- Expo EAS account (for mobile builds)

## Backend Deployment

### Option 1: Heroku (Easiest)

#### 1. Install Heroku CLI
```bash
npm install -g heroku
heroku login
```

#### 2. Prepare Backend
```bash
cd backend

# Create Procfile
echo "web: node dist/index.js" > Procfile

# Ensure package.json has start script
# "start": "node dist/index.js"
```

#### 3. Initialize Git (if not already done)
```bash
git init
git add .
git commit -m "Prepare for Heroku deployment"
```

#### 4. Create Heroku App
```bash
heroku create smart-pasal-api
```

#### 5. Set Environment Variables
```bash
heroku config:set NODE_ENV=production
heroku config:set PORT=3000
heroku config:set FIREBASE_PROJECT_ID=your-project-id
heroku config:set FIREBASE_CLIENT_EMAIL=your-client-email
heroku config:set FIREBASE_PRIVATE_KEY="your-private-key"
heroku config:set ALLOWED_ORIGINS=https://yourapp.com
```

#### 6. Deploy
```bash
# Add heroku buildpack for Node.js
heroku buildpacks:set heroku/nodejs

# Push to Heroku
git push heroku main

# Check logs
heroku logs --tail
```

#### 7. Test Deployment
```bash
curl https://smart-pasal-api.herokuapp.com/health
```

### Option 2: DigitalOcean App Platform

#### 1. Prepare Repository
Ensure your backend code is in a Git repository (GitHub, GitLab, etc.)

#### 2. Create App on DigitalOcean
1. Go to DigitalOcean App Platform
2. Click "Create App"
3. Connect your repository
4. Select the `backend` folder
5. Set build command: `npm run build`
6. Set run command: `npm start`

#### 3. Configure Environment Variables
In the DigitalOcean dashboard, add:
- `NODE_ENV=production`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `ALLOWED_ORIGINS`

#### 4. Deploy
DigitalOcean will automatically build and deploy your app.

### Option 3: AWS EC2 (Advanced)

#### 1. Launch EC2 Instance
- Choose Ubuntu 22.04 LTS
- t2.micro for testing (t2.small+ for production)
- Configure security group: Allow ports 22 (SSH), 80 (HTTP), 443 (HTTPS)

#### 2. SSH into Server
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

#### 3. Install Dependencies
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Nginx (reverse proxy)
sudo apt install -y nginx
```

#### 4. Deploy Application
```bash
# Clone repository
git clone https://github.com/your-repo/smart-pasal.git
cd smart-pasal/backend

# Install dependencies
npm install

# Build
npm run build

# Create .env file
nano .env
# Add your environment variables

# Start with PM2
pm2 start dist/index.js --name smart-pasal-api
pm2 startup
pm2 save
```

#### 5. Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/smart-pasal
```

Add:
```nginx
server {
    listen 80;
    server_name api.smartpasal.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/smart-pasal /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 6. Setup SSL with Let's Encrypt
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.smartpasal.com
```

## Mobile App Deployment

### Using Expo Application Services (EAS)

#### 1. Install EAS CLI
```bash
npm install -g eas-cli
```

#### 2. Login to Expo
```bash
eas login
```

#### 3. Configure EAS Build
```bash
cd mobile
eas build:configure
```

This creates `eas.json`:
```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  },
  "submit": {
    "production": {}
  }
}
```

#### 4. Update app.json
Ensure these fields are set:
```json
{
  "expo": {
    "name": "Smart Pasal",
    "slug": "smart-pasal",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.smartpasal.app"
    },
    "android": {
      "package": "com.smartpasal.app"
    }
  }
}
```

#### 5. Build for Android
```bash
# Development build
eas build --platform android --profile development

# Production build
eas build --platform android --profile production
```

#### 6. Build for iOS
```bash
# Note: Requires Apple Developer account ($99/year)
eas build --platform ios --profile production
```

#### 7. Submit to App Stores

**Google Play Store:**
```bash
eas submit --platform android
```

You'll need:
- Google Play Developer account ($25 one-time)
- Service account JSON key from Google Play Console

**Apple App Store:**
```bash
eas submit --platform ios
```

You'll need:
- Apple Developer account ($99/year)
- App Store Connect API key

### Alternative: Classic Build (Deprecated but simpler)

#### Android APK
```bash
expo build:android -t apk
```

Download the APK and distribute directly or upload to Play Store.

## Firebase Configuration for Production

### 1. Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(shopId) {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.shopId == shopId;
    }
    
    // Shop rules
    match /shops/{shopId} {
      allow read: if isAuthenticated() && resource.data.ownerId == request.auth.uid;
      allow write: if isAuthenticated() && resource.data.ownerId == request.auth.uid;
    }
    
    // Product rules
    match /products/{productId} {
      allow read: if isAuthenticated() && isOwner(resource.data.shopId);
      allow write: if isAuthenticated() && isOwner(resource.data.shopId);
    }
    
    // Apply similar rules for other collections
    match /sales/{saleId} {
      allow read, write: if isAuthenticated() && isOwner(resource.data.shopId);
    }
    
    match /customers/{customerId} {
      allow read, write: if isAuthenticated() && isOwner(resource.data.shopId);
    }
    
    match /suppliers/{supplierId} {
      allow read, write: if isAuthenticated() && isOwner(resource.data.shopId);
    }
    
    match /udharTransactions/{txId} {
      allow read, write: if isAuthenticated() && isOwner(resource.data.shopId);
    }
    
    match /stockTransactions/{txId} {
      allow read, write: if isAuthenticated() && isOwner(resource.data.shopId);
    }
  }
}
```

### 2. Create Indexes
For better query performance, create these indexes in Firestore:

1. **products**: `shopId` (Ascending), `isDeleted` (Ascending), `updatedAt` (Descending)
2. **sales**: `shopId` (Ascending), `createdAt` (Descending)
3. **customers**: `shopId` (Ascending), `isDeleted` (Ascending)
4. **udharTransactions**: `shopId` (Ascending), `customerId` (Ascending), `createdAt` (Descending)

### 3. Enable Firebase Services
- Authentication > Phone provider
- Firestore Database
- Cloud Storage (if using image uploads)

## Post-Deployment Checklist

### Backend
- [ ] API health check works
- [ ] Environment variables set correctly
- [ ] Firebase connection working
- [ ] CORS configured for mobile app
- [ ] HTTPS enabled (SSL certificate)
- [ ] Error logging configured
- [ ] Monitoring set up (optional: Sentry, LogRocket)

### Mobile App
- [ ] API endpoint updated to production URL
- [ ] Firebase config updated
- [ ] App icons and splash screens added
- [ ] Privacy policy and terms of service added
- [ ] App tested on multiple devices
- [ ] Crash reporting configured
- [ ] Analytics configured (optional)

### Firebase
- [ ] Security rules deployed
- [ ] Indexes created
- [ ] Billing enabled (if needed)
- [ ] Backup configured

## Monitoring & Maintenance

### Backend Monitoring
```bash
# View logs on Heroku
heroku logs --tail

# View PM2 logs on EC2
pm2 logs smart-pasal-api

# Monitor with PM2
pm2 monit
```

### Mobile App Monitoring
- Use Expo Analytics
- Configure Sentry for crash reporting
- Monitor app store reviews

### Database Maintenance
- Regular Firestore backups
- Monitor usage and costs
- Optimize indexes based on queries

## Rollback Procedure

### Backend
```bash
# Heroku - rollback to previous version
heroku releases
heroku rollback v123

# PM2 - restart from saved process
pm2 restart smart-pasal-api
```

### Mobile App
- Submit new build with previous version
- Or maintain multiple versions on store

## Cost Estimation

### Backend (Monthly)
- **Heroku Free Tier**: $0 (with limitations)
- **Heroku Hobby**: $7/month
- **DigitalOcean**: $5-10/month
- **AWS EC2**: $5-15/month

### Firebase (Monthly for small shop)
- **Free Tier**: Suitable for testing and small usage
- **Blaze (Pay as you go)**: ~$0-25/month for typical usage

### Mobile App Distribution
- **Google Play**: $25 one-time
- **Apple App Store**: $99/year
- **Expo EAS**: Free for limited builds, $29-99/month for more

## Security Best Practices

1. Never commit `.env` files to Git
2. Use strong Firebase security rules
3. Enable rate limiting on API
4. Regularly update dependencies
5. Use HTTPS only
6. Implement proper error handling (don't expose stack traces)
7. Validate all inputs
8. Use Firebase App Check for additional security

## Support & Troubleshooting

For deployment issues:
1. Check server logs
2. Verify environment variables
3. Test API endpoints with curl/Postman
4. Check Firebase console for errors
5. Review mobile app logs in Expo

---

**Need Help?**
- Review documentation in `docs/` folder
- Check Firebase documentation
- Expo documentation: https://docs.expo.dev
- Heroku documentation: https://devcenter.heroku.com

Good luck with your deployment! 🚀
