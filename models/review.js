const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  place: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true },
  rating: Number,
  date: { type: Date, default: Date.now },
  image: {  // New image field added
    type: String,  // You can change this to ObjectId if you are storing image IDs in a separate collection
    required: false,  // Make it optional, or set to true if you want it to be required
  },
});

// Check if the model is already registered, if not, create it
const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

module.exports = Review;
