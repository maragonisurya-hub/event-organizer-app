// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import API from '../utils/api';

const Home = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Load a preview of upcoming events
    API.get('/events')
      .then((res) => setEvents(res.data.slice(0, 3)))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="container">
      {/* Hero Section */}
      <div className="hero">
        <h1>Welcome to EventHub 🎉</h1>
        <p>Discover and register for amazing events happening near you.</p>
        <div>
          <Link to="/events" className="btn-white">Browse Events</Link>
          {!user && <Link to="/register" className="btn-white">Get Started</Link>}
          {user && user.role === 'user' && (
            <Link to="/dashboard" className="btn-white">My Dashboard</Link>
          )}
          {user && user.role === 'admin' && (
            <Link to="/admin/dashboard" className="btn-white">Admin Panel</Link>
          )}
        </div>
      </div>

      {/* Upcoming Events Preview */}
      <h2 className="section-title">Upcoming Events</h2>
      {events.length === 0 ? (
        <p style={{ color: '#888' }}>No events available yet. Check back soon!</p>
      ) : (
        <div className="card-grid">
          {events.map((event) => (
            <div key={event._id} className="event-card">
              <span className="badge">{event.category || 'General'}</span>
              <h3>{event.title}</h3>
              <p>📅 {new Date(event.date).toLocaleDateString()}</p>
              <p>📍 {event.location}</p>
              <p style={{ marginTop: '0.5rem', color: '#555' }}>
                {event.description.slice(0, 80)}...
              </p>
              <div style={{ marginTop: '1rem' }}>
                <Link to="/events" className="btn btn-success btn-sm">View Details</Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Features Section */}
      <div style={{ marginTop: '3rem' }}>
        <h2 className="section-title">Why EventHub?</h2>
        <div className="card-grid">
          {[
            { icon: '🎯', title: 'Easy Registration', desc: 'Register for events with a single click.' },
            { icon: '📊', title: 'Personal Dashboard', desc: 'Track all your registered events in one place.' },
            { icon: '💬', title: 'Share Feedback', desc: 'Rate and review events you attended.' },
          ].map((f, i) => (
            <div key={i} className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{f.icon}</div>
              <h3 style={{ marginBottom: '0.5rem' }}>{f.title}</h3>
              <p style={{ color: '#777', fontSize: '0.9rem' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
