// src/pages/UserDashboard.js
// Shows events the user has registered for + feedback form
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import API from '../utils/api';

const UserDashboard = () => {
  const { user } = useAuth();
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/events')
      .then((res) => setAllEvents(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Filter events the logged-in user has registered for
  const myEvents = allEvents.filter((e) => e.registeredUsers?.includes(user?._id));

  if (loading) return <div className="loading">Loading your dashboard...</div>;

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>👋 Welcome, {user?.name}!</h1>
        <p>Here's an overview of your event activity.</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-num">{allEvents.length}</div>
          <div className="stat-label">Total Events</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">{myEvents.length}</div>
          <div className="stat-label">My Registrations</div>
        </div>
      </div>

      {/* My Registered Events */}
      <h2 className="section-title">My Registered Events</h2>

      {myEvents.length === 0 ? (
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ color: '#888', marginBottom: '1rem' }}>You haven't registered for any events yet.</p>
          <Link to="/events" className="btn btn-success btn-sm">Browse Events</Link>
        </div>
      ) : (
        <div className="card-grid">
          {myEvents.map((event) => (
            <div key={event._id} className="event-card">
              <span className="badge">{event.category || 'General'}</span>
              <h3>{event.title}</h3>
              <p>📅 {new Date(event.date).toLocaleDateString()}</p>
              <p>📍 {event.location}</p>
              <div style={{ marginTop: '1rem' }}>
                <span className="registered-badge">✅ Registered</span>
                <Link
                  to={`/feedback?eventId=${event._id}&eventTitle=${encodeURIComponent(event.title)}`}
                  className="btn btn-warning btn-sm"
                  style={{ marginLeft: '8px' }}
                >
                  Give Feedback
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* All available events */}
      <h2 className="section-title" style={{ marginTop: '2rem' }}>All Available Events</h2>
      <div className="card-grid">
        {allEvents.filter((e) => !e.registeredUsers?.includes(user?._id)).map((event) => (
          <div key={event._id} className="event-card" style={{ borderLeftColor: '#28a745' }}>
            <span className="badge">{event.category || 'General'}</span>
            <h3>{event.title}</h3>
            <p>📅 {new Date(event.date).toLocaleDateString()}</p>
            <p>📍 {event.location}</p>
            <div style={{ marginTop: '1rem' }}>
              <Link to="/events" className="btn btn-success btn-sm">Register</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;
