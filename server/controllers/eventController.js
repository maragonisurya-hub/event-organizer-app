// controllers/eventController.js
// Handles all event CRUD operations
const Event = require('../models/Event');

// @route   GET /api/events
// @desc    Get all events
// @access  Public
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 }); // Sort by date ascending
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @route   GET /api/events/:id
// @desc    Get a single event by ID
// @access  Public
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @route   POST /api/events
// @desc    Create a new event (Admin only)
// @access  Private/Admin
const createEvent = async (req, res) => {
  try {
    const { title, description, date, location, category } = req.body;

    const event = await Event.create({
      title,
      description,
      date,
      location,
      category,
      createdBy: req.user._id, // Logged-in admin's ID
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @route   PUT /api/events/:id
// @desc    Update an event (Admin only)
// @access  Private/Admin
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const { title, description, date, location, category } = req.body;

    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.location = location || event.location;
    event.category = category || event.category;

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @route   DELETE /api/events/:id
// @desc    Delete an event (Admin only)
// @access  Private/Admin
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await event.deleteOne();
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @route   POST /api/events/:id/register
// @desc    Register logged-in user for an event
// @access  Private
const registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if already registered
    if (event.registeredUsers.includes(req.user._id)) {
      return res.status(400).json({ message: 'You are already registered for this event' });
    }

    event.registeredUsers.push(req.user._id);
    await event.save();

    res.json({ message: 'Successfully registered for the event!', event });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

module.exports = { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent, registerForEvent };
