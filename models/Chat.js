// models/Chat.js
const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
    enum: ['Traveler', 'Admin'] // Only two roles allowed
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Chat', chatSchema);
