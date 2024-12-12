const express = require('express');
const router = express.Router();
const safetyEquipmentController = require('../controllers/safetyEquipmentController');

router.post('/', safetyEquipmentController.createSafetyEquipment);

router.get('/', safetyEquipmentController.getAllSafetyEquipment);

router.get('/:id', safetyEquipmentController.getSafetyEquipmentById);
router.get('/getSafetyEquipmentById/:placeId', safetyEquipmentController.getSafetyEquipmentById);

router.put('/:id', safetyEquipmentController.updateSafetyEquipment);

router.delete('/:id', safetyEquipmentController.deleteSafetyEquipment);

module.exports = router;
