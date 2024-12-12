

const Camping = require('../models/Camping');

// Create a new camping point
const createCampingPoint = async (req, res) => {

  try {
    const campingPoint = new Camping(req.body);

    const savedCampingPoint = await campingPoint.save();
    res.status(201).json(savedCampingPoint);
  } catch (error) {
    res.status(400).json({ message: 'Error creating camping point', error });
  }
};

// Get all camping points
const getAllCampingPoints = async (req, res) => {
  try {
    const campingPoints = await Camping.find();
    res.status(200).json(campingPoints);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching camping points', error });
  }
};

// Get a single camping point by ID
const getCampingPointById = async (req, res) => {
  try {
    const campingPoint = await Camping.findById(req.params.id);
    if (!campingPoint) {
      return res.status(404).json({ message: 'Camping point not found' });
    }
    res.status(200).json(campingPoint);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching camping point', error });
  }
};

// Update an existing camping point by ID
const updateCampingPoint = async (req, res) => {
  try {
    const updatedCampingPoint = await Camping.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCampingPoint) {
      return res.status(404).json({ message: 'Camping point not found' });
    }
    res.status(200).json(updatedCampingPoint);
  } catch (error) {
    res.status(400).json({ message: 'Error updating camping point', error });
  }
};

// Delete a camping point by ID
const deleteCampingPoint = async (req, res) => {
  try {
    const campingPoint = await Camping.findByIdAndDelete(req.params.id);
    if (!campingPoint) {
      return res.status(404).json({ message: 'Camping point not found' });
    }
    res.status(200).json({ message: 'Camping point removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting camping point', error });
  }
};

// Get a single hiking trail by ID
const getCampByPlaceId = async (req, res) => {
    try {
      
      const {placeId} = req.params;
      const camp = await Camping.findOne({place:placeId});
      if (!camp) {
        return res.status(404).json({ message: 'Camping not found' });
      }
      res.status(200).json(camp);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

module.exports = {
  createCampingPoint,
  getAllCampingPoints,
  getCampingPointById,
  updateCampingPoint,
  deleteCampingPoint,
  getCampByPlaceId
};
