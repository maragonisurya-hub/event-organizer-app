// middleware/authMiddleware.js
// Protects routes by verifying JWT tokens and checking roles
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware: Verify the JWT token sent in the Authorization header
const protect = async (req, res, next) => {
  let token;

  // Token is sent as: "Bearer <token>"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]; // Extract token
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify it

      // Attach the user to the request (excluding password)
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Middleware: Only allow admins
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admins only' });
  }
};

module.exports = { protect, adminOnly };
