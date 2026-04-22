// controllers/feedbackController.js
// Handles feedback submission and retrieval
const Feedback = require('../models/Feedback');

// @route   POST /api/feedback
// @desc    Submit feedback for an event
// @access  Private (logged-in users)
const submitFeedback = async (req, res) => {
  try {
    const { eventId, message, rating } = req.body;

    // Prevent duplicate feedback from same user for same event
    const existing = await Feedback.findOne({ user: req.user._id, event: eventId });
    if (existing) {
      return res.status(400).json({ message: 'You have already submitted feedback for this event' });
    }

    const feedback = await Feedback.create({
      user: req.user._id,
      event: eventId,
      message,
      rating,
    });

    // Populate returns user name and event title instead of just IDs
    await feedback.populate('user', 'name email');
    await feedback.populate('event', 'title');

    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @route   GET /api/feedback
// @desc    Get all feedback (Admin only)
// @access  Private/Admin
const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('user', 'name email')
      .populate('event', 'title date')
      .sort({ createdAt: -1 });

    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @route   GET /api/feedback/event/:eventId
// @desc    Get feedback for a specific event
// @access  Public
const getFeedbackForEvent = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ event: req.params.eventId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

module.exports = { submitFeedback, getAllFeedback, getFeedbackForEvent };
