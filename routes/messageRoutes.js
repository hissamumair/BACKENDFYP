const express = require('express');
const { sendMessage ,getMessages, getUsersWithAdminMessages } = require('../controllers/messageControllers');

const router = express.Router();

router.post('/send', sendMessage);
router.get('/:receiverId/:senderId', getMessages);
router.get('/getAllChats', getUsersWithAdminMessages);


module.exports = router;
