const express = require('express');
const router = express.Router();
const { loginUser, registerUser, getMe } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.post('/login', loginUser);
router.post('/register', registerUser); // helper endpoint for creating test accounts
router.get('/me', protect, getMe);

module.exports = router;
