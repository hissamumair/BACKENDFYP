const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Get all bookings for a specific user
router.get('/getAllBookingForUser/:userId', bookingController.getAllBookingsForUser);

// Get all bookings (no filter)
router.get('/', bookingController.getBookings);

// Get a single booking by ID
router.get('/:id', bookingController.getBookingById);

// Create a new booking
router.post('/create', bookingController.createBooking);

// Update a booking by ID
router.put('/:id', bookingController.updateBooking);

// Delete a booking
router.delete('/:id', bookingController.deleteBooking);

module.exports = router;
