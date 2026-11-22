import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost } from '../api';

const CATEGORIES = ['General', 'Technology', 'Lifestyle', 'Education', 'Travel'];

export default function CreatePost({ onCancel, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    category: 'General',
    tags: '',
    imageUrl: ''
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      onSuccess();
    },
    onError: (err) => {
      alert(`Error creating post: ${err.message}`);
    }
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      alert('Title and content are required');
      return;
    }
    mutation.mutate(formData);
  };

  return (
    <div className="form-card">
      <h2 className="form-title">Write New Blog Post</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input 
            type="text" 
            id="title"
            name="title" 
            className="form-control" 
            placeholder="Enter an engaging post title"
            value={formData.title} 
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="author">Author Name</label>
          <input 
            type="text" 
            id="author"
            name="author" 
            className="form-control" 
            placeholder="Your name or pen name"
            value={formData.author} 
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select 
            id="category"
            name="category" 
            className="form-control" 
            value={formData.category} 
            onChange={handleChange}
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="imageUrl">Cover Image URL</label>
          <input 
            type="url" 
            id="imageUrl"
            name="imageUrl" 
            className="form-control" 
            placeholder="https://example.com/image.jpg (Optional)"
            value={formData.imageUrl} 
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags (comma separated)</label>
          <input 
            type="text" 
            id="tags"
            name="tags" 
            className="form-control" 
            placeholder="docker, react, kubernetes, fullstack"
            value={formData.tags} 
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content *</label>
          <textarea 
            id="content"
            name="content" 
            className="form-control" 
            placeholder="Write your article in full detail..."
            value={formData.content} 
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Publishing...' : 'Publish Post'}
          </button>
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={onCancel}
            disabled={mutation.isPending}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
