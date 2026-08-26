/**
 * User Routes
 *
 * Public:
 *   POST /api/users/login     – authenticate and receive JWT
 *   POST /api/users/register  – create a new user account (role is always 'user')
 *
 * Private:
 *   GET  /api/users/me        – return the authenticated user's profile
 */

const express = require('express');
const router  = express.Router();
const { loginUser, registerUser, getMe } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.post('/login',    loginUser);
router.post('/register', registerUser);
router.get('/me',        protect, getMe);

module.exports = router;
