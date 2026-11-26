const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = require('../models/Post');

// Initial in-memory posts if MongoDB is not reachable
let inMemoryPosts = [
  {
    _id: '6745ea101234567890abcdef',
    title: 'Cloud Deployment with Render, Docker & CI/CD',
    content: 'This full-stack MERN application is deployed and running live in the cloud. It features TanStack Query on React, Express.js backend, and persistent MongoDB integration.',
    author: 'Nusrat Perween',
    category: 'Technology',
    tags: ['docker', 'mern', 'render', 'cloud'],
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '6745ea101234567890abcdeg',
    title: 'React 18 & TanStack Query State Management',
    content: 'TanStack Query (React Query v5) provides declarative fetching, automated cache invalidation, and background synchronization, making CRUD operations seamless and responsive.',
    author: 'DevOps Engineer',
    category: 'Education',
    tags: ['react', 'tanstack-query', 'javascript'],
    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Helper to check if mongoose is fully connected
const isDbConnected = () => mongoose.connection.readyState === 1;

// GET all posts
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;

    if (isDbConnected()) {
      let query = {};
      if (category && category !== 'All') query.category = category;
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
          { author: { $regex: search, $options: 'i' } }
        ];
      }
      const posts = await Post.find(query).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: posts.length, data: posts });
    }

    // Fallback in-memory handler
    let result = [...inMemoryPosts];
    if (category && category !== 'All') {
      result = result.filter(p => p.category === category);
    }
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(s) || 
        p.content.toLowerCase().includes(s) || 
        p.author.toLowerCase().includes(s)
      );
    }
    return res.status(200).json({ success: true, count: result.length, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error while fetching posts', error: error.message });
  }
});

// GET single post by ID
router.get('/:id', async (req, res) => {
  try {
    if (isDbConnected()) {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
      return res.status(200).json({ success: true, data: post });
    }

    const post = inMemoryPosts.find(p => p._id.toString() === req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    return res.status(200).json({ success: true, data: post });
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

    const parsedTags = Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []);

    if (isDbConnected()) {
      const post = await Post.create({
        title,
        content,
        author: author || 'Anonymous',
        category: category || 'General',
        tags: parsedTags,
        imageUrl: imageUrl || undefined
      });
      return res.status(201).json({ success: true, message: 'Post created successfully', data: post });
    }

    // In-memory fallback create
    const newPost = {
      _id: new mongoose.Types.ObjectId().toString(),
      title,
      content,
      author: author || 'Anonymous',
      category: category || 'General',
      tags: parsedTags,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    inMemoryPosts.unshift(newPost);
    return res.status(201).json({ success: true, message: 'Post created successfully', data: newPost });
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

    if (isDbConnected()) {
      const post = await Post.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true
      });
      if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
      return res.status(200).json({ success: true, message: 'Post updated successfully', data: post });
    }

    const index = inMemoryPosts.findIndex(p => p._id.toString() === req.params.id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Post not found' });
    inMemoryPosts[index] = { ...inMemoryPosts[index], ...updateData, updatedAt: new Date().toISOString() };
    return res.status(200).json({ success: true, message: 'Post updated successfully', data: inMemoryPosts[index] });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error updating post', error: error.message });
  }
});

// DELETE post
router.delete('/:id', async (req, res) => {
  try {
    if (isDbConnected()) {
      const post = await Post.findByIdAndDelete(req.params.id);
      if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
      return res.status(200).json({ success: true, message: 'Post deleted successfully' });
    }

    const index = inMemoryPosts.findIndex(p => p._id.toString() === req.params.id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Post not found' });
    inMemoryPosts.splice(index, 1);
    return res.status(200).json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting post', error: error.message });
  }
});

module.exports = router;
