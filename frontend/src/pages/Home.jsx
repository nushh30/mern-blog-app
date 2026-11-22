import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPosts, deletePost } from '../api';
import PostCard from '../components/PostCard';

const CATEGORIES = ['All', 'General', 'Technology', 'Lifestyle', 'Education', 'Travel'];

export default function Home({ onSelectPost, onEditPost }) {
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  // TanStack Query to fetch posts with caching and background revalidation
  const { 
    data: posts, 
    isLoading, 
    isError, 
    error 
  } = useQuery({
    queryKey: ['posts', { category, search }],
    queryFn: () => fetchPosts({ category, search })
  });

  // TanStack Mutation for deleting post
  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      // Invalidate posts cache to trigger immediate UI refresh
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (err) => {
      alert(`Failed to delete post: ${err.message}`);
    }
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div>
      <section className="hero-section">
        <h1>Cloud & Dockerized MERN Blog</h1>
        <p>Full-stack blog platform integrated with TanStack Query, Docker Compose & CI/CD</p>
        <div className="badge-row">
          <span className="tech-badge">MongoDB</span>
          <span className="tech-badge">Express.js</span>
          <span className="tech-badge">React</span>
          <span className="tech-badge">Node.js</span>
          <span className="tech-badge">TanStack Query v5</span>
          <span className="tech-badge">Docker</span>
          <span className="tech-badge">GitHub Actions CI/CD</span>
          <span className="tech-badge">Google Cloud Run</span>
        </div>
      </section>

      <div className="controls-bar">
        <input 
          type="text"
          className="search-input"
          placeholder="Search by title, content or author..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select 
          className="category-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat} {cat === 'All' ? 'Categories' : ''}</option>
          ))}
        </select>
      </div>

      {isLoading && (
        <div className="state-box">
          <div className="spinner"></div>
          <p>Loading blog posts via TanStack Query...</p>
        </div>
      )}

      {isError && (
        <div className="state-box">
          <p style={{ color: 'var(--danger)' }}>Error loading posts: {error?.message}</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>Please make sure the backend container or service is running.</p>
        </div>
      )}

      {!isLoading && !isError && posts && posts.length === 0 && (
        <div className="state-box">
          <h3>No posts found</h3>
          <p>Get started by creating your very first blog article!</p>
        </div>
      )}

      {!isLoading && !isError && posts && posts.length > 0 && (
        <div className="posts-grid">
          {posts.map(post => (
            <PostCard 
              key={post._id} 
              post={post}
              onSelect={onSelectPost}
              onEdit={onEditPost}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
