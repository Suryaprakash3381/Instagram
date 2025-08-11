const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const Post = require('../Model/post.model.js');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/authMiddleware.js');

const Router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const uploadMiddleware = multer({ storage });

// Create Post
Router.post(
  '/create-post',
  verifyToken,
  uploadMiddleware.single('image'),
  async (req, res) => {
    try {
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
          caption: newPost.caption
        }
      });
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// Delete Post
Router.delete('/delete-post/:id', verifyToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    // Find the post
    const post = await Post.findById(postId);
    
    

    // Verify ownership
    if (post.createdBy.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized to delete this post' });
    }

    // Delete the image file
    const filePath = path.join(__dirname, '..', post.imageUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from database
    await Post.findByIdAndDelete(postId);

    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (err) {
    console.error('Delete post error:', err);
    res.status(500).json({ 
      message: 'Internal server error',
      error: err.message 
    });
  }
});

module.exports = Router;