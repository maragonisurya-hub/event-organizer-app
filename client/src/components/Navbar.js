// src/components/Navbar.js
// Dynamic navbar — shows different links based on login state and role
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">🎉 EventHub</Link>

      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/events">Events</Link></li>

        {/* Admin-only links */}
        {user && user.role === 'admin' && (
          <>
            <li><Link to="/admin/dashboard">Admin Panel</Link></li>
            <li><Link to="/admin/events/add">Add Event</Link></li>
          </>
        )}

        {/* User dashboard link */}
        {user && user.role === 'user' && (
          <li><Link to="/dashboard">My Dashboard</Link></li>
        )}

        {/* Show login/register if not logged in */}
        {!user && (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/admin/login">Admin</Link></li>
          </>
        )}

        {/* Show user name + logout if logged in */}
        {user && (
          <>
            <li>
              <span className="navbar-user">
                👤 {user.name} ({user.role})
              </span>
            </li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
