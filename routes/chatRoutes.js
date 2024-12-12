const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Route to get the chat history
router.get('/', chatController.getChatHistory);

// Route to post a new message
router.post('/', chatController.postMessage);

// Route to update a specific message by ID
router.put('/:id', chatController.updateMessage);

module.exports = router;
