const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const Post = require('../Model/post.model.js');
const verifyToken = require('../middleware/authMiddleware.js');

const Router = express.Router();

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  }
});

const uploadMiddleware = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Create Post
Router.post(
  '/create-post',
  verifyToken,
  uploadMiddleware.single('image'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No image uploaded' });
      }

      const { caption } = req.body;
      const imageUrl = `/uploads/${req.file.filename}`;

      const newPost = new Post({
        caption,
        imageUrl,
        createdBy: req.user.id,
      });

      await newPost.save();
      
      res.status(201).json({ 
        message: 'Post created successfully',
        post: {
          _id: newPost._id,
          imageUrl: newPost.imageUrl,
          caption: newPost.caption,
          createdAt: newPost.createdAt
        }
      });
    } catch (error) {
      console.error('Error creating post:', error);
      
      // Clean up uploaded file if error occurred
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      
      res.status(500).json({ 
        message: error.message || 'Internal server error' 
      });
    }
  }
);

// Delete Post
Router.delete('/delete-post/:id', verifyToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.createdBy.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized to delete this post' });
    }

    // Delete the image file
    const filePath = path.join(__dirname, '..', post.imageUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Post.findByIdAndDelete(postId);

    res.json({ 
      success: true, 
      message: 'Post deleted successfully' 
    });
  } catch (err) {
    console.error('Delete post error:', err);
    res.status(500).json({ 
      message: err.message || 'Internal server error'
    });
  }
});

module.exports = Router;