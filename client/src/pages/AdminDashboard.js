// src/pages/AdminDashboard.js
// Admin panel — manage events, view feedback, see stats
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import API from '../utils/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('events');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [eventsRes, feedbackRes] = await Promise.all([
        API.get('/events'),
        API.get('/feedback'),
      ]);
      setEvents(eventsRes.data);
      setFeedbacks(feedbackRes.data);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await API.delete(`/events/${id}`);
      setMessage('✅ Event deleted successfully.');
      fetchData();
    } catch (err) {
      setMessage('❌ Failed to delete event.');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const totalRegistrations = events.reduce((sum, e) => sum + (e.registeredUsers?.length || 0), 0);

  if (loading) return <div className="loading">Loading admin dashboard...</div>;

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>🛠️ Admin Dashboard</h1>
        <p>Welcome, {user?.name}. Manage events and view feedback below.</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-num">{events.length}</div>
          <div className="stat-label">Total Events</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">{totalRegistrations}</div>
          <div className="stat-label">Total Registrations</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">{feedbacks.length}</div>
          <div className="stat-label">Feedback Received</div>
        </div>
      </div>

      {message && <div className="alert alert-success">{message}</div>}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        {['events', 'feedback'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 20px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              background: activeTab === tab ? '#667eea' : '#eee',
              color: activeTab === tab ? 'white' : '#333',
              fontWeight: 500,
              transition: 'all 0.2s',
            }}
          >
            {tab === 'events' ? '📅 Events' : '💬 Feedback'}
          </button>
        ))}
        <Link to="/admin/events/add" className="btn btn-success btn-sm" style={{ marginLeft: 'auto' }}>
          + Add New Event
        </Link>
      </div>

      {/* Events Tab */}
      {activeTab === 'events' && (
        <div className="card">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Location</th>
                  <th>Registered</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', color: '#aaa' }}>No events yet.</td></tr>
                ) : (
                  events.map((event) => (
                    <tr key={event._id}>
                      <td><strong>{event.title}</strong></td>
                      <td>{new Date(event.date).toLocaleDateString()}</td>
                      <td>{event.location}</td>
                      <td>{event.registeredUsers?.length || 0}</td>
                      <td>
                        <div className="actions-row">
                          <Link to={`/admin/events/edit/${event._id}`} className="btn btn-warning btn-sm">Edit</Link>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(event._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Feedback Tab */}
      {activeTab === 'feedback' && (
        <div className="card">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Event</th>
                  <th>Rating</th>
                  <th>Feedback</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', color: '#aaa' }}>No feedback yet.</td></tr>
                ) : (
                  feedbacks.map((fb) => (
                    <tr key={fb._id}>
                      <td>{fb.user?.name}</td>
                      <td>{fb.event?.title}</td>
                      <td>{'★'.repeat(fb.rating)}{'☆'.repeat(5 - fb.rating)}</td>
                      <td>{fb.message}</td>
                      <td>{new Date(fb.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
