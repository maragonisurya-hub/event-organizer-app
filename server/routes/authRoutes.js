// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);   // POST /api/auth/register
router.post('/login', loginUser);          // POST /api/auth/login
router.get('/profile', protect, getUserProfile); // GET /api/auth/profile (protected)

module.exports = router;
