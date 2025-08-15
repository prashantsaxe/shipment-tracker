const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getUserProfile
} = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST /api/users/register
router.post('/register', registerUser);

// @route   POST /api/users/login
router.post('/login', loginUser);

// @route   GET /api/users/profile
router.get('/profile', authMiddleware, getUserProfile);

module.exports = router;
