const express = require('express');
const router = express.Router();
const {
  createAccommodation,
  getAccommodations,
  getAccommodationById,
  updateAccommodation,
  deleteAccommodation,
} = require('../controllers/accommodationController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getAccommodations);
router.get('/:id', getAccommodationById);
router.post('/', protect, authorize('host', 'admin'), createAccommodation);
router.put('/:id', protect, authorize('host', 'admin'), updateAccommodation);
router.delete('/:id', protect, authorize('host', 'admin'), deleteAccommodation);

module.exports = router;
