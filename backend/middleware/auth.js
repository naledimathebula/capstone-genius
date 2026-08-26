/**
 * Authentication Middleware
 *
 * protect   – verifies the Bearer JWT in the Authorization header,
 *             fetches the user from the database, and attaches them
 *             to req.user. Returns 401 if the token is missing or invalid.
 *
 * authorize – role-based access control factory. Call with one or more
 *             allowed roles, e.g. authorize('admin', 'host').
 *             Returns 403 if the authenticated user's role is not included.
 *
 * Usage:
 *   router.put('/:id', protect, authorize('host', 'admin'), updateHandler);
 */

const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// ─────────────────────────────────────────────────────────────
// protect – verify JWT and attach user to request
// ─────────────────────────────────────────────────────────────
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorised, no token provided' });
  }

  try {
    const token   = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch fresh user from DB — omit password field
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'Not authorised, user not found' });
    }

    next();
  } catch (error) {
    // Distinguish expired tokens from other JWT errors for clearer client messages
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Not authorised, token has expired' });
    }
    return res.status(401).json({ message: 'Not authorised, token is invalid' });
  }
};

// ─────────────────────────────────────────────────────────────
// authorize(...roles) – restrict access to specific roles
// ─────────────────────────────────────────────────────────────
const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({
      message: `Forbidden: requires one of [${roles.join(', ')}] role`,
    });
  }
  next();
};

module.exports = { protect, authorize };
