const express = require('express');
const {
    createPlace,
    getPlaces,
    getPlaceById,
    updatePlace,
    deletePlace,
    addReview
} = require('../controllers/placeController');

const router = express.Router();

// Route to create a new place
router.post('/', createPlace);

// Route to get all places
router.get('/', getPlaces);

// Route to get a single place by ID
router.get('/:id', getPlaceById);

// Route to update a place by ID
router.put('/:id', updatePlace);

// Route to delete a place by ID
router.delete('/:id', deletePlace);

// Route to add a review to a place
router.post('/:placeId/reviews', addReview);

module.exports = router;
