// src/pages/EventForm.js
// Used for BOTH adding a new event and editing an existing one
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../utils/api';

const EventForm = () => {
  const { id } = useParams(); // If id exists → edit mode, else → add mode
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    category: 'General',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // In edit mode, pre-fill form with existing event data
  useEffect(() => {
    if (isEdit) {
      API.get(`/events/${id}`)
        .then(({ data }) => {
          setFormData({
            title: data.title,
            description: data.description,
            date: data.date?.split('T')[0], // Format date for <input type="date">
            location: data.location,
            category: data.category || 'General',
          });
        })
        .catch(() => setError('Failed to load event details'));
    }
  }, [id, isEdit]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isEdit) {
        await API.put(`/events/${id}`, formData);
      } else {
        await API.post('/events', formData);
      }
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container" style={{ maxWidth: 560 }}>
      <h2>{isEdit ? '✏️ Edit Event' : '➕ Add New Event'}</h2>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Event Title</label>
          <input name="title" type="text" placeholder="Tech Conference 2025" value={formData.title} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea name="description" placeholder="Describe the event..." value={formData.description} onChange={handleChange} required rows={4} />
        </div>
        <div className="form-group">
          <label>Date</label>
          <input name="date" type="date" value={formData.date} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input name="location" type="text" placeholder="Hyderabad, Telangana" value={formData.location} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Category</label>
          <select name="category" value={formData.category} onChange={handleChange}>
            <option>General</option>
            <option>Technology</option>
            <option>Music</option>
            <option>Sports</option>
            <option>Education</option>
            <option>Business</option>
            <option>Art & Culture</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ flex: 1 }}>
            {loading ? 'Saving...' : isEdit ? 'Update Event' : 'Create Event'}
          </button>
          <button type="button" className="btn" style={{ background: '#eee', color: '#333' }} onClick={() => navigate('/admin/dashboard')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
