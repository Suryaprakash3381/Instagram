// 📁 backend/src/routes/authRoutes.js

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Model/user.model.js');
const Post = require('../Model/post.model.js');
const verifyToken = require('../middleware/authMiddleware.js');

const Router = express.Router();
console.log("Auth routes initialized");
// ✅ REGISTER
Router.post('/register', async (req, res) => {
  try {
    const { username, email, password, fullname } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      fullname,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('❌ Error during registration:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ LOGIN
Router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: existingUser._id },
      'NEUCLEAR_SECRET_KEY',
      { expiresIn: '1d' }
    );

    res
      .cookie('authToken', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        secure: false, // true if using HTTPS
      })
      .status(200)
      .json({ message: 'Login successful' });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



// ✅ PROFILE
Router.get('/profile', verifyToken, async (req, res) => {
  try {
    console.log('📥 Profile endpoint hit');
    console.log('👤 req.user.id:', req.user.id);

    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const posts = await Post.find({ createdBy: userId });

    res.status(200).json({
      username: user.username,
      fullname: user.fullname,
      images: posts.map((post) => post.imageUrl),
      posts: posts,
      bio: user.bio || '', // Include bio if available
    });
  } catch (err) {
    console.error('❌ Error fetching profile:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

Router.get('/user-profile/:userId', verifyToken, async (req, res) => {
  try {
    // Get user by ID
    console.log('Requested userId:', req.params.userId);
const user = await User.findById(req.params.userId).select('-password');
console.log('Found user:', user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get posts made by this user
    const posts = await Post.find({ createdBy: user._id });

    // Send user data + posts together in response
    return res.status(200).json({
      ...user.toObject(),
      posts: posts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});  



//search profile

Router.post('/search-user', verifyToken , async (req , res) => {
  try {
       const {username} = req.body
       if(!username){
        return res.status(400).json({message: "Username is required"})
       }

       const existingUser =  await User.findOne({ username })

       if(!existingUser) {
       return res.status(404).json({message : "User not found"})
       }
       
       return  res.status(200).json({
        message: "user found",
        user: existingUser
      })

    } catch (error) {
    console.log(error)
  }
})



Router.post('/logout' , async (req , res) => {
  try {
    res.clearCookie('authToken');
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('❌ Logout error:', error);
    res.status(500).json({ message: 'Server error' });
    
  }
})






//Update user profile

Router.put('/update-profile', verifyToken, async (req, res) => {
  try {
    const { fullname, username, bio } = req.body;
    const userId = req.user.id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fullname, username, bio },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        fullname: updatedUser.fullname,
        username: updatedUser.username,
        bio: updatedUser.bio
      },
    });
  } catch (err) {
    console.error('❌ Error updating profile:', err);
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: Object.values(err.errors).map(e => e.message) 
      });
    }
    
    // Handle duplicate username
    if (err.code === 11000) {
      return res.status(400).json({ 
        message: 'Username already exists' 
      });
    }
    
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = Router;
