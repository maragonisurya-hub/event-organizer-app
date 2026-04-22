// src/utils/api.js
// Central Axios instance — automatically attaches the JWT token to every request
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Change this if your backend runs on a different port
});

// Intercept every request and add the Authorization header if a token exists
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default API;
