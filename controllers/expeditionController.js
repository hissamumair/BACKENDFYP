const Expedition = require('../models/Expedition'); // Ensure this path is correct

// Function to create an expedition
const createExpedition = async (req, res) => {
    try {
        const expedition = new Expedition(req.body);
        await expedition.save();
        res.status(201).json(expedition);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Function to get all expeditions
const getExpeditions = async (req, res) => {
    try {
        const expeditions = await Expedition.find();
        res.status(200).json(expeditions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Export the functions
module.exports = { createExpedition, getExpeditions };
