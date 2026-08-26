/**
 * User Controller
 * Handles authentication and user profile operations.
 *
 * Routes:
 *   POST /api/users/login     – login, returns JWT (public)
 *   POST /api/users/register  – register new user account (public; role is always 'user')
 *   GET  /api/users/me        – return current user profile (private)
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ─────────────────────────────────────────────────────────────
// Helper – sign a JWT for the given user ID
// ─────────────────────────────────────────────────────────────
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// ─────────────────────────────────────────────────────────────
// @desc   Authenticate a user and return a JWT
// @route  POST /api/users/login
// @access Public
// ─────────────────────────────────────────────────────────────
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────
// @desc   Register a new user account
//         Role is always set to 'user' regardless of the request
//         body — callers cannot self-assign privileged roles.
// @route  POST /api/users/register
// @access Public
// ─────────────────────────────────────────────────────────────
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'A user with that email already exists' });
    }

    // Force role to 'user' — never accept role from request body
    const user = await User.create({ username, email, password, role: 'user' });

    res.status(201).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────
// @desc   Return the currently authenticated user's profile
// @route  GET /api/users/me
// @access Private
// ─────────────────────────────────────────────────────────────
const getMe = async (req, res) => {
  // req.user is already populated by the protect middleware (password excluded)
  res.json(req.user);
};

module.exports = { loginUser, registerUser, getMe };
