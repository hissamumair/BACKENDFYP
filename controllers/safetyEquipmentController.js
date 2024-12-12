const SafetyEquipment = require('../models/SafetyEquipment');

// Create new safety equipment
exports.createSafetyEquipment = async (req, res) => {
  try {
    const equipment = new SafetyEquipment(req.body);
    await equipment.save();
    res.status(201).json(equipment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get safety equipment by place ID
exports.getSafetyEquipmentByPlaceId = async (req, res) => {
  try {
    const { placeId } = req.params;
    const equipment = await SafetyEquipment.findOne({ place: placeId });
    if (!equipment) {
      return res.status(404).json({ message: 'Safety equipment not found for this place' });
    }
    res.status(200).json(equipment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all safety equipment
exports.getAllSafetyEquipment = async (req, res) => {
  try {
    const equipmentList = await SafetyEquipment.find();
    res.status(200).json(equipmentList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get safety equipment by ID
exports.getSafetyEquipmentById = async (req, res) => {
  try {
    console.log("id is", req.params)
    const {placeId}= req.params;
    const equipment = await SafetyEquipment.findOne({place:placeId});
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    res.status(200).json(equipment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update safety equipment
exports.updateSafetyEquipment = async (req, res) => {
  try {
    const equipment = await SafetyEquipment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    res.status(200).json(equipment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete safety equipment
exports.deleteSafetyEquipment = async (req, res) => {
  try {
    const equipment = await SafetyEquipment.findByIdAndDelete(req.params.id);
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    res.status(200).json({ message: 'Equipment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
