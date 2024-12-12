const Place = require('../models/place');
const Review = require('../models/review');

// Create a new place
exports.createPlace = async (req, res) => {
    const { name, description, latitude, longitude, address, ratings } = req.body;

    try {
        const newPlace = new Place({
            name,
            description,
            location: {
                latitude,
                longitude
            },
            address,
            ratings
        });
        await newPlace.save();
        res.status(201).json({ message: 'Place created successfully!', place: newPlace });
    } catch (error) {
        res.status(400).json({ message: 'Error creating place', error });
    }
};

// Get all places
exports.getPlaces = async (req, res) => {
    try {
        const places = await Place.find().populate('reviews');  // Populate reviews for each place
        res.status(200).json(places);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching places', error });
    }
};

// Get a single place by ID
exports.getPlaceById = async (req, res) => {
    const { id } = req.params;

    try {
        const place = await Place.findById(id).populate('reviews');
        if (!place) return res.status(404).json({ message: 'Place not found' });

        res.status(200).json(place);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching place', error });
    }
};

// Update place by ID
exports.updatePlace = async (req, res) => {
    const { id } = req.params;
    const { name, description, latitude, longitude, address, ratings } = req.body;

    try {
        const updatedPlace = await Place.findByIdAndUpdate(
            id,
            {
                name,
                description,
                location: { latitude, longitude },
                address,
                ratings
            },
            { new: true }  // Return the updated document
        );

        if (!updatedPlace) return res.status(404).json({ message: 'Place not found' });

        res.status(200).json({ message: 'Place updated successfully', place: updatedPlace });
    } catch (error) {
        res.status(500).json({ message: 'Error updating place', error });
    }
};

// Delete place by ID
exports.deletePlace = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedPlace = await Place.findByIdAndDelete(id);

        if (!deletedPlace) return res.status(404).json({ message: 'Place not found' });

        res.status(200).json({ message: 'Place deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting place', error });
    }
};

// Add a review to a place
exports.addReview = async (req, res) => {
    const { placeId } = req.params;
    const { name, title, comment, rating } = req.body;

    try {
        // Create a new review
        const newReview = new Review({
            name,
            title,
            comment,
            rating
        });

        // Save the review
        await newReview.save();

        // Find the place and add the review reference
        const place = await Place.findById(placeId);
        if (!place) return res.status(404).json({ message: 'Place not found' });

        place.reviews.push(newReview._id);  // Add the review ID to the place
        await place.save();

        res.status(200).json({ message: 'Review added successfully', review: newReview });
    } catch (error) {
        res.status(500).json({ message: 'Error adding review', error });
    }
};
