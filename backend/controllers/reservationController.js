const Reservation = require('../models/Reservation');
const Accommodation = require('../models/Accommodation');

// @route  POST /api/reservations
// @access Private
const createReservation = async (req, res) => {
  try {
    const { accommodation: accommodationId, checkIn, checkOut, guests } = req.body;

    const accommodation = await Accommodation.findById(accommodationId);
    if (!accommodation) {
      return res.status(404).json({ message: 'Accommodation not found' });
    }

    const nights = Math.ceil(
      (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
    );
    if (!nights || nights < 1) {
      return res.status(400).json({ message: 'Invalid check-in/check-out dates' });
    }

    const subtotal = accommodation.price * nights;
    const discount = (subtotal * accommodation.weeklyDiscount) / 100;
    const totalCost =
      subtotal -
      discount +
      accommodation.cleaningFee +
      accommodation.serviceFee +
      accommodation.occupancyTaxes;

    const reservation = await Reservation.create({
      accommodation: accommodationId,
      user: req.user._id,
      host: accommodation.host,
      checkIn,
      checkOut,
      guests,
      nights,
      pricePerNight: accommodation.price,
      weeklyDiscount: accommodation.weeklyDiscount,
      cleaningFee: accommodation.cleaningFee,
      serviceFee: accommodation.serviceFee,
      occupancyTaxes: accommodation.occupancyTaxes,
      totalCost,
    });

    res.status(201).json(reservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @route  GET /api/reservations/host
// @access Private (host)
const getReservationsByHost = async (req, res) => {
  try {
    const reservations = await Reservation.find({ host: req.user._id })
      .populate('accommodation')
      .populate('user', 'username email');
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/reservations/user
// @access Private
const getReservationsByUser = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id }).populate('accommodation');
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  DELETE /api/reservations/:id
// @access Private
const deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    // Only the owner, host, or an admin may cancel
    const isOwner = reservation.user.toString() === req.user._id.toString();
    const isHost = reservation.host.toString() === req.user._id.toString();
    if (!isOwner && !isHost && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this reservation' });
    }
    await reservation.deleteOne();
    res.json({ message: 'Reservation deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReservation,
  getReservationsByHost,
  getReservationsByUser,
  deleteReservation,
};
