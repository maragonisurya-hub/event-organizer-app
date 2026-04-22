// src/pages/Events.js
// Shows all events; logged-in users can register for them
import React, { useEffect, useState } from 'react';
import { useAuth } from '../utils/AuthContext';
import API from '../utils/api';

const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data } = await API.get('/events');
      setEvents(data);
    } catch (err) {
      console.error('Failed to fetch events', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId) => {
    if (!user) {
      setMessage('Please login to register for events.');
      setMessageType('error');
      return;
    }
    try {
      await API.post(`/events/${eventId}/register`);
      setMessage('✅ Successfully registered for the event!');
      setMessageType('success');
      fetchEvents(); // Refresh to update registered state
    } catch (err) {
      setMessage(err.response?.data?.message || 'Registration failed');
      setMessageType('error');
    }
    // Auto-clear message after 3 seconds
    setTimeout(() => setMessage(''), 3000);
  };

  const isRegistered = (event) => {
    return user && event.registeredUsers?.includes(user._id);
  };

  if (loading) return <div className="loading">Loading events...</div>;

  return (
    <div className="container">
      <h1 className="page-title">All Events</h1>
      <p className="page-subtitle">Browse and register for upcoming events.</p>

      {message && (
        <div className={`alert alert-${messageType === 'success' ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {events.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', color: '#888' }}>
          <p>No events available right now. Check back later!</p>
        </div>
      ) : (
        <div className="card-grid">
          {events.map((event) => (
            <div key={event._id} className="event-card">
              <span className="badge">{event.category || 'General'}</span>
              <h3>{event.title}</h3>
              <p>📅 {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p>📍 {event.location}</p>
              <p style={{ margin: '0.7rem 0', color: '#555', fontSize: '0.9rem', lineHeight: 1.5 }}>
                {event.description}
              </p>
              <p style={{ color: '#888', fontSize: '0.82rem' }}>
                👥 {event.registeredUsers?.length || 0} registered
              </p>

              <div style={{ marginTop: '1rem' }}>
                {!user && (
                  <p style={{ fontSize: '0.85rem', color: '#999' }}>Login to register</p>
                )}
                {user && user.role === 'user' && (
                  isRegistered(event) ? (
                    <span className="registered-badge">✅ Registered</span>
                  ) : (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleRegister(event._id)}
                    >
                      Register Now
                    </button>
                  )
                )}
                {user && user.role === 'admin' && (
                  <span style={{ fontSize: '0.85rem', color: '#aaa' }}>Admin view</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
