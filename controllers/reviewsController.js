const Review = require('../models/review');
const { findByIdAndUpdate } = require('../models/SafetyEquipment');

// Get all reviews
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ message: err.message });
  }
};

// Add new review
exports.addReview = async (req, res) => {
  const review = new Review(req.body);

  try {
    const newReview = await review.save();
    res.status(201).json(newReview);
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(400).json({ message: err.message });
  }
};
exports.getReviewsByplaceId = async (req, res) => {
  try {
    const { placeId } = req.params;
    const equipment = await Review.find({ place: placeId });
    if (!equipment) {
      return res.status(404).json({ message: 'Review not found for this place' });
    }
    res.status(200).json(equipment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Update review by ID
exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    // review.name = req.body.name;
    // review.title = req.body.title;
    // review.comment = req.body.comment;
    // review.rating = req.body.rating;

    // const updatedReview = await review.save();
    const updatedReview = findByIdAndUpdate(req.params.id, req.body)
    res.json(updatedReview);
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(400).json({ message: err.message });
  }
};

// Delete review by ID
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    await review.remove();
    res.json({ message: 'Review deleted' });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ message: err.message });
  }
};
