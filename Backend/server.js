const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes.js');
const postRoutes = require('./src/routes/postRoutes.js');
const path = require('path');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');


dotenv.config();

const app = express();

const PORT = 3000;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/post', postRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/instagram', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Default Route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('❌ Error:', err);
    res.status(500).json({ message: 'Internal server error' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
