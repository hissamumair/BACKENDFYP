const express = require('express');
const router = express.Router();
const hikingController = require('../controllers/hikingController'); // Adjust path if needed

// @route   GET /api/hiking
router.get('/getAll', hikingController.getAllHikes);

// @route   GET /api/hiking/:id
router.get('/:id', hikingController.getHikeById);
router.get('/getHikeByPlaceId/:placeId', hikingController.getHikeByPlaceId);

// @route   POST /api/hiking
router.post('/create', hikingController.createHike);

// @route   PUT /api/hiking/:id
router.put('/:id', hikingController.updateHike);

// @route   DELETE /api/hiking/:id
router.delete('/:id', hikingController.deleteHike);

module.exports = router;
