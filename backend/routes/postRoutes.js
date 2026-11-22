const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// GET all posts
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }

    const posts = await Post.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: posts.length, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error while fetching posts', error: error.message });
  }
});

// GET single post by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving post', error: error.message });
  }
});

// POST create new post
router.post('/', async (req, res) => {
  try {
    const { title, content, author, category, tags, imageUrl } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    const post = await Post.create({
      title,
      content,
      author: author || 'Anonymous',
      category: category || 'General',
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
      imageUrl: imageUrl || undefined
    });

    res.status(201).json({ success: true, message: 'Post created successfully', data: post });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error creating post', error: error.message });
  }
});

// PUT update post
router.put('/:id', async (req, res) => {
  try {
    const { tags } = req.body;
    const updateData = { ...req.body };
    if (typeof tags === 'string') {
      updateData.tags = tags.split(',').map(t => t.trim());
    }

    const post = await Post.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    res.status(200).json({ success: true, message: 'Post updated successfully', data: post });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error updating post', error: error.message });
  }
});

// DELETE post
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    res.status(200).json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting post', error: error.message });
  }
});

module.exports = router;
