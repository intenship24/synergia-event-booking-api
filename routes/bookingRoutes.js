const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// ✅ Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bookings', error: err.message });
  }
});

// ✅ Create a new booking
router.post('/', async (req, res) => {
  try {
    const { name, email, event, ticketType } = req.body;
    if (!name || !email || !event) {
      return res.status(400).json({ message: 'Name, email, and event are required' });
    }

    const newBooking = new Booking({ name, email, event, ticketType });
    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (err) {
    res.status(500).json({ message: 'Error creating booking', error: err.message });
  }
});

// ✅ Search booking by email (PLACE BEFORE :id)
router.get('/search', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email query is required' });

    const booking = await Booking.findOne({ email });
    if (!booking) return res.status(404).json({ message: 'No booking found for that email' });

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Error searching booking', error: err.message });
  }
});

// ✅ Filter bookings by event (PLACE BEFORE :id)
router.get('/filter', async (req, res) => {
  try {
    const { event } = req.query;
    if (!event) return res.status(400).json({ message: 'Event query is required' });

    const bookings = await Booking.find({ event });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Error filtering bookings', error: err.message });
  }
});

// ✅ Get booking by ID (KEEP THIS BELOW SEARCH/FILTER)
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(400).json({ message: 'Invalid ID or server error', error: err.message });
  }
});

// ✅ Update booking by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBooking) return res.status(404).json({ message: 'Booking not found' });
    res.json(updatedBooking);
  } catch (err) {
    res.status(400).json({ message: 'Error updating booking', error: err.message });
  }
});

// ✅ Delete booking by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
    if (!deletedBooking) return res.status(404).json({ message: 'Booking not found' });
    res.json({ message: 'Booking deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting booking', error: err.message });
  }
});

module.exports = router;
