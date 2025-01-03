const express = require('express');
const { register, login, forget, resetPassword, verifyOTP, getCurrentUser, getDashboardData ,  getUsers, 
} = require('../controllers/userController');

const router = express.Router();

router.post('/register', register);
router.post('/getCurrentUser/:userId', getCurrentUser);
router.post('/login', login);
router.post('/forget', forget);
router.post('/verify-otp', verifyOTP);
router.post('/resetPass/:token', resetPassword); 
router.get('/dashboard', getDashboardData);
router.get('/user', getUsers);  // New route to get all users


module.exports = router;
