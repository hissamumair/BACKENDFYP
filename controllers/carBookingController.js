const CarBooking = require('../models/CarBooking');

// Get all car bookings
exports.getCarBookings = async (req, res) => {
  try {
    const bookings = await CarBooking.find().populate('user'); // Populate user and car details
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getAllCarBookingsForUser = async (req, res) => {
  try {
    const userId = req.params.userId;  // Extract userId from the URL parameters

    // Query to find bookings for the user with the given userId
    const bookings = await CarBooking.find({ user: userId });

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: 'No car bookings found for this user.' });
    }

    res.status(200).json(bookings);  // Return the bookings for the user
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get a single car booking by ID
exports.getCarBookingById = async (req, res) => {
  try {
    const booking = await CarBooking.findById(req.params.id).populate('user car');
    if (!booking) return res.status(404).json({ message: "Car booking not found" });
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new car booking
exports.createCarBooking = async (req, res) => {
  const { user, car, startDate, endDate, pickupLocation, dropoffLocation, deposit, contactNumber, email, fullName } = req.body;

  const carBooking = new CarBooking({
    user,
    car,
    startDate,
    endDate,
    pickupLocation,
    dropoffLocation,
    deposit,
    contactNumber,
    email,
    fullName,
  });

  try {
    const newCarBooking = await carBooking.save();
    res.status(201).json(newCarBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a car booking by ID
exports.updateCarBooking = async (req, res) => {
  const { startDate, endDate, pickupLocation, dropoffLocation, deposit, contactNumber, email, fullName, status } = req.body;

  try {
    const carBooking = await CarBooking.findByIdAndUpdate(
      req.params.id,
      { startDate, endDate, pickupLocation, dropoffLocation, deposit, contactNumber, email, fullName, status },
      { new: true } // Return the updated document
    );
    if (!carBooking) return res.status(404).json({ message: "Car booking not found" });
    res.status(200).json(carBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a car booking by ID
exports.deleteCarBooking = async (req, res) => {
  try {
    const carBooking = await CarBooking.findByIdAndDelete(req.params.id);
    if (!carBooking) return res.status(404).json({ message: "Car booking not found" });
    res.status(200).json({ message: "Car booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
