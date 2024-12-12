const Booking = require('../models/Booking');

// Get all bookings (no filter)
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();  // Get all bookings from the database
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all bookings for a specific user
exports.getAllBookingsForUser = async (req, res) => {
  try {
    const userId = req.params.userId;  // Extract userId from the URL parameters

    // Query to find bookings for the user with the given userId
    const bookings = await Booking.find({ user: userId });

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: 'No bookings found for this user.' });
    }

    res.status(200).json(bookings);  // Return the bookings for the user
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new booking
exports.createBooking = async (req, res) => {
  const { startDate, endDate, deposit, status, user, contactNumber, gender, email, fullName } = req.body;
  console.log("object, ",req.body)
  const booking = new Booking(req.body);

  try {
    const newBooking = await booking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a booking by ID
exports.updateBooking = async (req, res) => {
  const { startDate, endDate, deposit, status, user, contactNumber, gender, email, fullName } = req.body;

  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { startDate, endDate, deposit, status, user, contactNumber, gender, email, fullName },
      { new: true } // Return the updated document
    );
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a booking by ID
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
