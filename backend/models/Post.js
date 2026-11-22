const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Post title is required'],
      trim: true
    },
    content: {
      type: String,
      required: [true, 'Post content is required']
    },
    author: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
      default: 'Anonymous'
    },
    category: {
      type: String,
      required: true,
      default: 'General',
      enum: ['General', 'Technology', 'Lifestyle', 'Education', 'Travel']
    },
    tags: [
      {
        type: String,
        trim: true
      }
    ],
    imageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Post', postSchema);
