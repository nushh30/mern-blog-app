import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPostById, updatePost } from '../api';

const CATEGORIES = ['General', 'Technology', 'Lifestyle', 'Education', 'Travel'];

export default function EditPost({ postId, onCancel, onSuccess }) {
  const queryClient = useQueryClient();

  const { data: post, isLoading } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => fetchPostById(postId)
  });

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    category: 'General',
    tags: '',
    imageUrl: ''
  });

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        content: post.content || '',
        author: post.author || '',
        category: post.category || 'General',
        tags: post.tags ? post.tags.join(', ') : '',
        imageUrl: post.imageUrl || ''
      });
    }
  }, [post]);

  const mutation = useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      onSuccess();
    },
    onError: (err) => {
      alert(`Error updating post: ${err.message}`);
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
    mutation.mutate({
      id: postId,
      ...formData
    });
  };

  if (isLoading) {
    return (
      <div className="state-box">
        <div className="spinner"></div>
        <p>Loading post data for editing...</p>
      </div>
    );
  }

  return (
    <div className="form-card">
      <h2 className="form-title">Edit Blog Post</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input 
            type="text" 
            id="title"
            name="title" 
            className="form-control" 
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
            {mutation.isPending ? 'Saving Changes...' : 'Save Changes'}
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
