/**
 * Accommodation Controller
 * Handles CRUD operations for property listings.
 *
 * Routes:
 *   POST   /api/accommodations        – create  (host/admin)
 *   GET    /api/accommodations        – list all, optional ?location= filter (public)
 *   GET    /api/accommodations/:id    – single listing (public)
 *   PUT    /api/accommodations/:id    – update  (owner host or admin)
 *   DELETE /api/accommodations/:id    – delete  (owner host or admin)
 */

const Accommodation = require('../models/Accommodation');

// ─────────────────────────────────────────────────────────────
// Helper – verify the caller owns the listing or is an admin.
// Returns the accommodation document when authorised, or sends
// the appropriate error response and returns null.
// ─────────────────────────────────────────────────────────────
const getOwnedAccommodation = async (req, res) => {
  const accommodation = await Accommodation.findById(req.params.id);

  if (!accommodation) {
    res.status(404).json({ message: 'Accommodation not found' });
    return null;
  }

  // Admins may edit any listing; hosts may only edit their own
  const isOwner = accommodation.host.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    res.status(403).json({ message: 'Not authorised to modify this listing' });
    return null;
  }

  return accommodation;
};

// ─────────────────────────────────────────────────────────────
// @desc   Create a new accommodation listing
// @route  POST /api/accommodations
// @access Private (host / admin)
// ─────────────────────────────────────────────────────────────
const createAccommodation = async (req, res) => {
  try {
    const accommodation = await Accommodation.create({
      ...req.body,
      host: req.user._id,
    });
    res.status(201).json(accommodation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────
// @desc   Get all accommodations (optional ?location= filter)
// @route  GET /api/accommodations
// @access Public
// ─────────────────────────────────────────────────────────────
const getAccommodations = async (req, res) => {
  try {
    const { location } = req.query;
    const filter = location ? { location: new RegExp(location, 'i') } : {};
    const accommodations = await Accommodation.find(filter).populate('host', 'username email');
    res.json(accommodations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────
// @desc   Get a single accommodation by ID
// @route  GET /api/accommodations/:id
// @access Public
// ─────────────────────────────────────────────────────────────
const getAccommodationById = async (req, res) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id).populate(
      'host',
      'username email'
    );
    if (!accommodation) {
      return res.status(404).json({ message: 'Accommodation not found' });
    }
    res.json(accommodation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────
// @desc   Update an accommodation listing
// @route  PUT /api/accommodations/:id
// @access Private (owner host or admin)
// ─────────────────────────────────────────────────────────────
const updateAccommodation = async (req, res) => {
  try {
    const accommodation = await getOwnedAccommodation(req, res);
    if (!accommodation) return; // error already sent

    // Prevent host field from being overwritten via the request body
    delete req.body.host;

    const updated = await Accommodation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────
// @desc   Delete an accommodation listing
// @route  DELETE /api/accommodations/:id
// @access Private (owner host or admin)
// ─────────────────────────────────────────────────────────────
const deleteAccommodation = async (req, res) => {
  try {
    const accommodation = await getOwnedAccommodation(req, res);
    if (!accommodation) return; // error already sent

    await accommodation.deleteOne();
    res.json({ message: 'Accommodation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAccommodation,
  getAccommodations,
  getAccommodationById,
  updateAccommodation,
  deleteAccommodation,
};
