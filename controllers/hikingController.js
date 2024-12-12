const Hiking = require('../models/Hiking');

// Get all hiking trails
const getAllHikes = async (req, res) => {
  try {
    const hikes = await Hiking.find();
    res.status(200).json(hikes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single hiking trail by ID
const getHikeById = async (req, res) => {
  try {
    const hike = await Hiking.findById(req.params.id);
    if (!hike) {
      return res.status(404).json({ message: 'Hiking trail not found' });
    }
    res.status(200).json(hike);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single hiking trail by ID
const getHikeByPlaceId = async (req, res) => {
  try {
    const {placeId} = req.params;
    const hike = await Hiking.findOne({place:placeId});
    if (!hike) {
      return res.status(404).json({ message: 'Hiking trail not found' });
    }
    res.status(200).json(hike);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new hiking trail
const createHike = async (req, res) => {

  const newHiking = new Hiking(req.body);

  try {
    const savedHike = await newHiking.save();
    res.status(201).json(savedHike);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update an existing hiking trail by ID
const updateHike = async (req, res) => {
  try {
    const updatedHike = await Hiking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updatedHike) {
      return res.status(404).json({ message: 'Hiking trail not found' });
    }

    res.status(200).json(updatedHike);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a hiking trail by ID
const deleteHike = async (req, res) => {
  try {
    const hike = await Hiking.findByIdAndDelete(req.params.id);

    if (!hike) {
      return res.status(404).json({ message: 'Hiking trail not found' });
    }

    res.status(200).json({ message: 'Hiking trail deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllHikes,
  getHikeById,
  createHike,
  updateHike,
  deleteHike,
  getHikeByPlaceId
};
