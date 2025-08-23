import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { TeamDirectory } from './components/TeamDirectory';
import { teamMembers } from './data/teamMembers';
import Blog from './blog-app/src/App.tsx'; // Import the blog's App.tsx here

export default function App() {
  return (
    <Router>
      <nav style={{ padding: '1rem', background: '#333', color: 'white', display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
        <Link to="/blog" style={{ color: 'white', textDecoration: 'none' }}>Blog</Link>
      </nav>
      
      <div style={{ padding: '1.5rem', maxWidth: '1200px', margin: 'auto' }}>
        <Routes>
          <Route path="/" element={<TeamDirectory members={teamMembers} />} />
          <Route path="/blog" element={<Blog />} />
        </Routes>
      </div>
    </Router>
  );
}