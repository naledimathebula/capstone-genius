const Accommodation = require('../models/Accommodation');

// @route  POST /api/accommodations
// @access Private (host/admin)
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

// @route  GET /api/accommodations
// @access Public
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

// @route  GET /api/accommodations/:id
// @access Public
const getAccommodationById = async (req, res) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id).populate('host', 'username email');
    if (!accommodation) {
      return res.status(404).json({ message: 'Accommodation not found' });
    }
    res.json(accommodation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PUT /api/accommodations/:id
// @access Private (host/admin)
const updateAccommodation = async (req, res) => {
  try {
    const accommodation = await Accommodation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!accommodation) {
      return res.status(404).json({ message: 'Accommodation not found' });
    }
    res.json(accommodation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @route  DELETE /api/accommodations/:id
// @access Private (host/admin)
const deleteAccommodation = async (req, res) => {
  try {
    const accommodation = await Accommodation.findByIdAndDelete(req.params.id);
    if (!accommodation) {
      return res.status(404).json({ message: 'Accommodation not found' });
    }
    res.json({ message: 'Accommodation deleted' });
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
