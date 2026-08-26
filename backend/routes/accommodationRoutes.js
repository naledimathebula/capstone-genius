/**
 * Accommodation Routes
 *
 * Public:
 *   GET  /api/accommodations          – list all (optional ?location= filter)
 *   GET  /api/accommodations/:id      – get single listing
 *
 * Private (host or admin only):
 *   POST   /api/accommodations        – create listing
 *   PUT    /api/accommodations/:id    – update listing (owner or admin)
 *   DELETE /api/accommodations/:id    – delete listing (owner or admin)
 */

const express = require('express');
const router  = express.Router();
const {
  createAccommodation,
  getAccommodations,
  getAccommodationById,
  updateAccommodation,
  deleteAccommodation,
} = require('../controllers/accommodationController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/',    getAccommodations);
router.get('/:id', getAccommodationById);

// Protected routes — host or admin only
router.post('/',    protect, authorize('host', 'admin'), createAccommodation);
router.put('/:id',  protect, authorize('host', 'admin'), updateAccommodation);
router.delete('/:id', protect, authorize('host', 'admin'), deleteAccommodation);

module.exports = router;
