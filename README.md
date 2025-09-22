# 🍎 NutriTrack - AI-Powered Nutrition Tracker

A comprehensive MERN stack application that helps gym enthusiasts and health-conscious individuals track their nutrition through AI-powered photo analysis. Simply take a photo of your meal, and our advanced AI will analyze and extract detailed nutritional information automatically.

## ✨ Features

### 🤖 AI-Powered Photo Analysis
- **Smart Food Recognition**: Upload photos of your meals and get instant nutritional analysis
- **Detailed Nutrition Breakdown**: Get calories, protein, carbs, fat, fiber, sugar, and sodium information
- **Confidence Scoring**: See how confident the AI is in its analysis
- **Multiple Food Items**: Analyze complex meals with multiple ingredients

### 📊 Comprehensive Tracking
- **Real-time Dashboard**: View your daily, weekly, and monthly nutrition progress
- **Goal Tracking**: Set and monitor personalized nutrition goals
- **Progress Visualization**: Beautiful charts and graphs showing your nutrition trends
- **Streak Tracking**: Maintain consistency with daily logging streaks

### 📱 Mobile-First Design
- **Responsive UI**: Optimized for all devices - desktop, tablet, and mobile
- **Touch-Friendly**: Easy photo capture and navigation on mobile devices
- **Progressive Web App**: Install as a native app on your device
- **Offline Capability**: Core features work even without internet connection

### 🔐 Enterprise-Grade Security
- **JWT Authentication**: Secure token-based authentication with httpOnly cookies
- **Password Hashing**: bcryptjs with salt rounds for secure password storage
- **Input Validation**: Comprehensive validation on both frontend and backend
- **Rate Limiting**: Protection against abuse and spam
- **CORS Configuration**: Secure cross-origin resource sharing

### 🎯 Advanced Features
- **Meal Type Classification**: Categorize meals as breakfast, lunch, dinner, or snacks
- **Edit & Delete**: Modify or remove meals after analysis
- **Filtering & Search**: Find specific meals by type, date, or nutrition content
- **Export Data**: Download your nutrition data for external analysis
- **Profile Management**: Comprehensive user profiles with health metrics

## 🚀 Technology Stack

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **AWS S3** for scalable cloud storage
- **AWS CloudFront** for global CDN (optional)
- **Nutritionix API** for food analysis
- **Google Vision API** for advanced image recognition
- **Multer** for file uploads
- **Helmet** for security headers

### Frontend
- **React 19** with modern hooks
- **React Router v7** for navigation
- **Chart.js** for data visualization
- **Axios** for API communication
- **Context API** for state management
- **CSS Grid & Flexbox** for responsive design

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account or local MongoDB
- AWS account with S3 access
- Nutritionix API account
- Google Cloud Vision API (optional, for enhanced analysis)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd NutriTrack/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the backend directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/nutritrack
   JWT_SECRET=your-super-secret-jwt-key
   CORS_ORIGIN=http://localhost:3000
   PORT=5000
   
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   
   # Nutritionix API
   NUTRITIONIX_APP_ID=your-app-id
   NUTRITIONIX_API_KEY=your-api-key
   
   # Google Vision API (optional)
   GOOGLE_APPLICATION_CREDENTIALS=path-to-service-account.json
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the frontend directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start the development server**
   ```bash
   npm start
   ```
   Application will run on `http://localhost:3000`

## 🎯 Usage Guide

### Getting Started
1. **Register**: Create a new account with your email and password
2. **Set Goals**: Configure your daily nutrition targets in the Profile section
3. **Upload Meals**: Take photos of your meals using the camera or upload from gallery
4. **Review Analysis**: Verify and edit the AI-generated nutrition information
5. **Track Progress**: Monitor your daily, weekly, and monthly nutrition progress

### Best Practices for Photo Analysis
- **Good Lighting**: Take photos in well-lit environments
- **Clear Focus**: Ensure food items are clearly visible and in focus
- **Complete View**: Include the entire meal in the frame
- **Multiple Angles**: For complex meals, consider multiple photos
- **Avoid Obstructions**: Keep hands, utensils, and other objects out of the way

### Mobile Usage
- **Camera Access**: Allow camera permissions for optimal photo capture
- **Install PWA**: Add to home screen for app-like experience
- **Offline Mode**: Core features work without internet connection
- **Touch Gestures**: Swipe and tap for intuitive navigation

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### User Management
- `GET /api/user/me` - Get current user profile
- `PUT /api/user/me` - Update user profile
- `GET /api/user/stats` - Get user statistics
- `POST /api/user/avatar` - Upload profile picture
- `DELETE /api/user/account` - Delete user account

### Meal Management
- `GET /api/meals` - Get user's meals (with pagination and filtering)
- `POST /api/meals` - Add meal manually
- `POST /api/meals/upload` - Upload meal photo for analysis
- `GET /api/meals/stats` - Get meal statistics
- `PUT /api/meals/:id` - Update meal
- `DELETE /api/meals/:id` - Delete meal

## 🎨 Customization

### Styling
The application uses a modern CSS approach with:
- CSS Grid and Flexbox for layouts
- CSS Custom Properties for theming
- Responsive design principles
- Smooth animations and transitions

### Branding
- Update colors in `frontend/src/App.css`
- Modify logo and favicon in `frontend/public/`
- Customize app name in `frontend/public/index.html`

## 🚀 Deployment

### Backend Deployment (Heroku)
1. Create a Heroku app
2. Set environment variables in Heroku dashboard
3. Connect to GitHub repository
4. Enable automatic deployments

### Frontend Deployment (Netlify/Vercel)
1. Build the production version: `npm run build`
2. Deploy the `build` folder to your hosting service
3. Set environment variables for production API URL

### Database
- Use MongoDB Atlas for production database
- Set up proper indexes for performance
- Configure backup and monitoring

## 🔒 Security Considerations

- **Environment Variables**: Never commit sensitive data to version control
- **HTTPS**: Use SSL certificates in production
- **Rate Limiting**: Implement rate limiting for API endpoints
- **Input Sanitization**: Validate and sanitize all user inputs
- **CORS**: Configure CORS properly for production domains
- **Security Headers**: Use Helmet.js for security headers

## 📈 Performance Optimization

- **Image Optimization**: Cloudinary automatically optimizes uploaded images
- **Database Indexing**: Proper indexes on frequently queried fields
- **Caching**: Implement Redis for session and data caching
- **CDN**: Use Cloudinary's CDN for fast image delivery
- **Code Splitting**: React's built-in code splitting for faster loading

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Photo upload and analysis
- [ ] Meal editing and deletion
- [ ] Dashboard data accuracy
- [ ] Mobile responsiveness
- [ ] Offline functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation
- Review the FAQ section

## 🔮 Future Enhancements

- **Social Features**: Share progress with friends and family
- **Recipe Integration**: Save and share favorite meals
- **Barcode Scanning**: Scan product barcodes for instant nutrition info
- **Wearable Integration**: Connect with fitness trackers
- **Meal Planning**: AI-powered meal suggestions
- **Restaurant Integration**: Find nutrition info for restaurant meals
- **Voice Commands**: Voice-activated meal logging
- **Advanced Analytics**: Machine learning insights and recommendations

---

**Built with ❤️ for health-conscious individuals and fitness enthusiasts**