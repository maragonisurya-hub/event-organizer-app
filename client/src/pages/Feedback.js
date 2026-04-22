// src/pages/Feedback.js
// Allows logged-in users to submit feedback/rating for events they registered for
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../utils/api';

const Feedback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const eventId = params.get('eventId');
  const eventTitle = params.get('eventTitle') || 'Event';

  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [hovered, setHovered] = useState(0);
  const [status, setStatus] = useState('');
  const [statusType, setStatusType] = useState('success');
  const [loading, setLoading] = useState(false);

  // Load all events if no eventId passed, so user can pick one
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(eventId || '');
  const [selectedTitle, setSelectedTitle] = useState(eventTitle);

  useEffect(() => {
    if (!eventId) {
      API.get('/events').then((res) => setEvents(res.data)).catch(console.error);
    }
  }, [eventId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEvent) {
      setStatus('Please select an event.');
      setStatusType('error');
      return;
    }
    setLoading(true);
    try {
      await API.post('/feedback', { eventId: selectedEvent, message, rating });
      setStatus('✅ Feedback submitted successfully! Thank you.');
      setStatusType('success');
      setMessage('');
      setRating(5);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setStatus(err.response?.data?.message || 'Failed to submit feedback');
      setStatusType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container" style={{ maxWidth: 540 }}>
      <h2>💬 Submit Feedback</h2>
      <p style={{ textAlign: 'center', color: '#777', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Share your experience to help us improve.
      </p>

      {status && <div className={`alert alert-${statusType === 'success' ? 'success' : 'error'}`}>{status}</div>}

      <form onSubmit={handleSubmit}>
        {/* Event selector (shown only if no eventId in URL) */}
        {!eventId ? (
          <div className="form-group">
            <label>Select Event</label>
            <select
              value={selectedEvent}
              onChange={(e) => {
                setSelectedEvent(e.target.value);
                const ev = events.find((ev) => ev._id === e.target.value);
                setSelectedTitle(ev?.title || '');
              }}
              required
            >
              <option value="">-- Choose an event --</option>
              {events.map((ev) => (
                <option key={ev._id} value={ev._id}>{ev.title}</option>
              ))}
            </select>
          </div>
        ) : (
          <div className="form-group">
            <label>Event</label>
            <input type="text" value={selectedTitle} readOnly style={{ background: '#f8f9fa', cursor: 'default' }} />
          </div>
        )}

        {/* Star Rating */}
        <div className="form-group">
          <label>Rating</label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${star <= (hovered || rating) ? 'active' : ''}`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
              >
                ★
              </span>
            ))}
          </div>
          <p style={{ fontSize: '0.85rem', color: '#888' }}>
            {rating === 1 ? 'Poor' : rating === 2 ? 'Fair' : rating === 3 ? 'Good' : rating === 4 ? 'Very Good' : 'Excellent'}
          </p>
        </div>

        {/* Message */}
        <div className="form-group">
          <label>Your Feedback</label>
          <textarea
            placeholder="Tell us about your experience with this event..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={4}
          />
        </div>

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
};

export default Feedback;
