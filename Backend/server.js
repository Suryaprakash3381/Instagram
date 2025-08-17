const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes.js');
const postRoutes = require('./src/routes/postRoutes.js');
const path = require('path');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const fs = require('fs');

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'src/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Enhanced CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://instagram-6wnf.onrender.com'
  ],
  credentials: true,
  exposedHeaders: ['Content-Disposition']
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files with proper headers
app.use('/uploads', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(uploadsDir));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/post', postRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://suryaprakashsahoo4105:Surya2005@cluster2.wtuip.mongodb.net/instagram', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});