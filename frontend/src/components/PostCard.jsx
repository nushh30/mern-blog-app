import React from 'react';

export default function PostCard({ post, onSelect, onEdit, onDelete }) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <article className="post-card">
      <img 
        src={post.imageUrl || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800'} 
        alt={post.title} 
        className="post-card-img"
        loading="lazy"
      />
      <div className="post-card-body">
        <span className="post-category">{post.category || 'General'}</span>
        <h3 className="post-title">{post.title}</h3>
        <p className="post-excerpt">
          {post.content.length > 110 
            ? `${post.content.substring(0, 110)}...` 
            : post.content}
        </p>
        
        <div className="post-meta">
          <div>
            <strong>{post.author || 'Anonymous'}</strong>
            <div>{formattedDate}</div>
          </div>
          
          <div className="card-actions">
            <button 
              className="btn-sm btn-view" 
              onClick={() => onSelect(post._id)}
            >
              Read
            </button>
            <button 
              className="btn-sm btn-edit" 
              onClick={() => onEdit(post._id)}
            >
              Edit
            </button>
            <button 
              className="btn-sm btn-delete" 
              onClick={() => onDelete(post._id)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
