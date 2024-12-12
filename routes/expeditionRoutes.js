const express = require('express');
const { createExpedition, getExpeditions } = require('../controllers/expeditionController'); // Correctly reference the controller
const { authMiddleware } = require('../middleware/authMiddleware'); // Correctly reference the middleware

const router = express.Router();

router.post('/', authMiddleware, createExpedition);
router.get('/', authMiddleware, getExpeditions);

module.exports = router;
