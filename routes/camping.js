const express = require('express');
const {
    createCampingPoint,
    getAllCampingPoints,
    getCampingPointById,
    updateCampingPoint,
    deleteCampingPoint,
    getCampByPlaceId,
   
} = require('../controllers/campingController');

const router = express.Router();

// Camping Points Routes
router.post('/create', createCampingPoint);               // Create a new camping point
router.get('/all', getAllCampingPoints);                  // Get all camping points
router.get('/:id', getCampingPointById);                  
router.get('/getCampByPlaceId/:placeId', getCampByPlaceId);                  
router.put('/:id/update', updateCampingPoint);            
router.delete('/:id/delete', deleteCampingPoint);         

module.exports = router;
