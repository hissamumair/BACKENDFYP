// models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  startDate: { type: Date, },
  endDate: { type: Date,  },
  deposit: { type: Number,  },
  status: { type: String, enum: ['Available', 'Sold Out'], },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the user who booked
  contactNumber: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], },
  email: { type: String, },
  fullName: { type: String, required: true },
});

module.exports = mongoose.model('Booking', bookingSchema);
