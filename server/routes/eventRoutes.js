// routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
} = require('../controllers/eventController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getAllEvents);                            // Public: view all events
router.get('/:id', getEventById);                        // Public: view single event
router.post('/', protect, adminOnly, createEvent);       // Admin: create event
router.put('/:id', protect, adminOnly, updateEvent);     // Admin: update event
router.delete('/:id', protect, adminOnly, deleteEvent);  // Admin: delete event
router.post('/:id/register', protect, registerForEvent); // User: register for event

module.exports = router;
