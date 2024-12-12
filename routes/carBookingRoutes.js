const express = require('express');
const router = express.Router();
const carBookingController = require('../controllers/carBookingController');


router.get('/getAllCarBookingForUser/:userId',carBookingController.getAllCarBookingsForUser);

// Get all car bookings
router.get('/', carBookingController.getCarBookings);

// Get a single car booking by ID
router.get('/:id', carBookingController.getCarBookingById);

// Create a new car booking
router.post('/', carBookingController.createCarBooking);

// Update a car booking by ID
router.put('/:id', carBookingController.updateCarBooking);

// Delete a car booking
router.delete('/:id', carBookingController.deleteCarBooking);

module.exports = router;
