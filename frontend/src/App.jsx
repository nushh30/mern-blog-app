import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PostDetails from './pages/PostDetails';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import './App.css';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedPostId, setSelectedPostId] = useState(null);

  const handleNavigate = (view) => {
    setCurrentView(view);
    if (view === 'home' || view === 'create') {
      setSelectedPostId(null);
    }
  };

  const handleSelectPost = (id) => {
    setSelectedPostId(id);
    setCurrentView('detail');
  };

  const handleEditPost = (id) => {
    setSelectedPostId(id);
    setCurrentView('edit');
  };

  return (
    <div className="app-container">
      <Navbar onNavigate={handleNavigate} />
      
      <main className="main-content">
        {currentView === 'home' && (
          <Home 
            onSelectPost={handleSelectPost} 
            onEditPost={handleEditPost} 
          />
        )}

        {currentView === 'detail' && selectedPostId && (
          <PostDetails 
            postId={selectedPostId} 
            onBack={() => handleNavigate('home')} 
            onEdit={handleEditPost}
          />
        )}

        {currentView === 'create' && (
          <CreatePost 
            onCancel={() => handleNavigate('home')} 
            onSuccess={() => handleNavigate('home')} 
          />
        )}

        {currentView === 'edit' && selectedPostId && (
          <EditPost 
            postId={selectedPostId} 
            onCancel={() => handleNavigate('home')} 
            onSuccess={() => handleNavigate('home')} 
          />
        )}
      </main>

      <footer className="footer">
        <p>© 2026-2027 CSE 3395 Web Application Projects with React | Assignment 4: Containerization & Cloud Deployment</p>
      </footer>
    </div>
  );
}
