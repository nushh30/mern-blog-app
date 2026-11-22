import React from 'react';

export default function Navbar({ onNavigate }) {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <a 
          href="#home" 
          className="nav-logo" 
          onClick={(e) => {
            e.preventDefault();
            onNavigate('home');
          }}
        >
          <span>🚀</span> MERN Blog
        </a>
        <div className="nav-links">
          <a 
            href="#home" 
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('home');
            }}
          >
            All Posts
          </a>
          <button 
            className="nav-btn"
            onClick={() => onNavigate('create')}
          >
            + Create Post
          </button>
        </div>
      </div>
    </nav>
  );
}
