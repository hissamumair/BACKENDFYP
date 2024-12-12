const mongoose = require('mongoose');

const carBookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  // car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },  
  // Reference to the car being booked car to negot
  startDate: { type: Date},
  endDate: { type: Date},

  pickupLocation: { type: String},
  dropoffLocation: { type: String},
  status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' },
  deposit: { type: Number},
  contactNumber: { type: String},
  gender:{type:String},
  // email: { type: String, required: true },
  fullName: { type: String},
}, { timestamps: true }); 

module.exports = mongoose.model('CarBooking', carBookingSchema);
