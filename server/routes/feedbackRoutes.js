// routes/feedbackRoutes.js
const express = require('express');
const router = express.Router();
const { submitFeedback, getAllFeedback, getFeedbackForEvent } = require('../controllers/feedbackController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', protect, submitFeedback);                        // User: submit feedback
router.get('/', protect, adminOnly, getAllFeedback);              // Admin: view all feedback
router.get('/event/:eventId', getFeedbackForEvent);              // Public: feedback for event

module.exports = router;
