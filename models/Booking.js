// models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  startDate: { type: Date, },
  endDate: { type: Date,  },
  deposit: { type: Number,  },
  status: { type: String, enum: ['Available', 'Sold Out', 'Pending', 'Completed', 'Canceled'] },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  contactNumber: { type: String },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], },
  email: { type: String, },
  fullName: { type: String, required: true },
  carName: { type: String },
  paymentScreenshot: { type: String } // Add this line to store the payment screenshot URL

});

module.exports = mongoose.model('Booking', bookingSchema);
