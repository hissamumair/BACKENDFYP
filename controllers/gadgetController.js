const Gadget = require("../models/gadget"); // Ensure correct model import

// Get all gadgets
exports.getAllGadgets = async (req, res) => {
  try {
    const gadgets = await Gadget.find();
    res.json(gadgets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get gadget by ID
exports.getGadgetById = async (req, res) => {
  try {
    const gadget = await Gadget.findById(req.params.id);
    if (!gadget) {
      return res.status(404).json({ message: 'Gadget not found' });
    }
    res.json(gadget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get gadget by Place ID¡
exports.getGadgetByPlaceId = async (req, res) => { // Corrected function name
  try {
    const { placeId } = req.params;
    const gadget = await Gadget.findOne({ place: placeId });
    if (!gadget) {
      return res.status(404).json({ message: 'Gadget not found' });
    }
    res.status(200).json(gadget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new gadget
exports.createGadget = async (req, res) => {

  const newGadget = new Gadget(req.body);

  try {
    const savedGadget = await newGadget.save();
    res.status(201).json(savedGadget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update gadget by ID
exports.updateGadgetById = async (req, res) => {
  try {
    const gadget = await Gadget.findById(req.params.id);
    if (!gadget) {
      return res.status(404).json({ message: 'Gadget not found' });
    }

    // Update fields if they exist in the request body
    gadget.category = req.body.category || gadget.category;
    gadget.name = req.body.name || gadget.name;
    gadget.description = req.body.description || gadget.description;
    gadget.imageUrl = req.body.imageUrl || gadget.imageUrl;
    gadget.price = req.body.price || gadget.price;
    gadget.features = req.body.features || gadget.features;

    const updatedGadget = await gadget.save();
    res.json(updatedGadget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete gadget by ID
exports.deleteGadgetById = async (req, res) => {
  try {
    const gadget = await Gadget.findById(req.params.id);
    if (!gadget) {
      return res.status(404).json({ message: 'Gadget not found' });
    }

    await gadget.remove();
    res.json({ message: 'Gadget deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
