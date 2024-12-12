const express = require('express');
const { register, login, forget, resetPassword, verifyOTP, getCurrentUser } = require('../controllers/userController');

const router = express.Router();

router.post('/register', register);
router.post('/getCurrentUser/:userId', getCurrentUser);
router.post('/login', login);
router.post('/forget', forget);
router.post('/verify-otp', verifyOTP);
router.post('/resetPass/:token', resetPassword); 

module.exports = router;
