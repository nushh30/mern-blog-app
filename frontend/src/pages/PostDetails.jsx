import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPostById, deletePost } from '../api';

export default function PostDetails({ postId, onBack, onEdit }) {
  const queryClient = useQueryClient();

  const { data: post, isLoading, isError, error } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => fetchPostById(postId)
  });

  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      onBack();
    }
  });

  if (isLoading) {
    return (
      <div className="state-box">
        <div className="spinner"></div>
        <p>Fetching article details...</p>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="state-box">
        <p style={{ color: 'var(--danger)' }}>Could not load post: {error?.message}</p>
        <button className="btn-secondary" onClick={onBack} style={{ marginTop: '1rem' }}>
          Back to list
        </button>
      </div>
    );
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="post-detail-container">
      <img 
        src={post.imageUrl || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800'} 
        alt={post.title} 
        className="detail-img"
      />
      <span className="post-category">{post.category}</span>
      <h1 className="detail-title">{post.title}</h1>
      
      <div className="detail-meta">
        <div>Published by <strong>{post.author}</strong> on {formattedDate}</div>
        {post.tags && post.tags.length > 0 && (
          <div>Tags: {post.tags.join(', ')}</div>
        )}
      </div>

      <div className="detail-content">
        {post.content}
      </div>

      <div className="detail-actions">
        <button className="btn-secondary" onClick={onBack}>
          ← Back to All Posts
        </button>
        <button className="btn-primary" onClick={() => onEdit(post._id)}>
          Edit Post
        </button>
        <button 
          className="btn-sm btn-delete" 
          style={{ padding: '0.75rem 1.25rem', fontSize: '1rem' }}
          onClick={() => {
            if (window.confirm('Are you sure you want to delete this post?')) {
              deleteMutation.mutate(post._id);
            }
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
