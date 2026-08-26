/**
 * Reservation Controller
 * Handles creation, retrieval, and deletion of reservations.
 *
 * Routes:
 *   POST   /api/reservations        – create a reservation (authenticated users)
 *   GET    /api/reservations/host   – get reservations for the logged-in host (host/admin)
 *   GET    /api/reservations/user   – get reservations for the logged-in user (authenticated)
 *   DELETE /api/reservations/:id    – cancel a reservation (owner, host, or admin)
 */

const Reservation    = require('../models/Reservation');
const Accommodation  = require('../models/Accommodation');

// ─────────────────────────────────────────────────────────────
// @desc   Create a new reservation
//         Calculates total cost from accommodation pricing fields.
//         Validates check-in/out dates and guest count.
// @route  POST /api/reservations
// @access Private (any authenticated user)
// ─────────────────────────────────────────────────────────────
const createReservation = async (req, res) => {
  try {
    const { accommodation: accommodationId, checkIn, checkOut, guests } = req.body;

    // Validate the referenced accommodation exists
    const accommodation = await Accommodation.findById(accommodationId);
    if (!accommodation) {
      return res.status(404).json({ message: 'Accommodation not found' });
    }

    // Validate dates
    const checkInDate  = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (isNaN(checkInDate) || isNaN(checkOutDate)) {
      return res.status(400).json({ message: 'Invalid date format' });
    }
    if (checkOutDate <= checkInDate) {
      return res.status(400).json({ message: 'Check-out must be after check-in' });
    }

    // Calculate number of nights (ceiling division)
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    if (nights < 1) {
      return res.status(400).json({ message: 'Minimum stay is 1 night' });
    }

    // Validate guest count against listing capacity
    if (guests > accommodation.guests) {
      return res.status(400).json({
        message: `This listing accommodates a maximum of ${accommodation.guests} guests`,
      });
    }

    // Calculate total cost: (price × nights) − weekly-discount% + fees
    const subtotal       = accommodation.price * nights;
    const discountAmount = Math.round((subtotal * (accommodation.weeklyDiscount || 0)) / 100);
    const totalCost =
      subtotal -
      discountAmount +
      (accommodation.cleaningFee    || 0) +
      (accommodation.serviceFee     || 0) +
      (accommodation.occupancyTaxes || 0);

    const reservation = await Reservation.create({
      accommodation: accommodationId,
      user:          req.user._id,
      host:          accommodation.host,
      checkIn:       checkInDate,
      checkOut:      checkOutDate,
      guests,
      nights,
      pricePerNight:   accommodation.price,
      weeklyDiscount:  accommodation.weeklyDiscount || 0,
      cleaningFee:     accommodation.cleaningFee    || 0,
      serviceFee:      accommodation.serviceFee     || 0,
      occupancyTaxes:  accommodation.occupancyTaxes || 0,
      totalCost,
    });

    res.status(201).json(reservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────
// @desc   Get all reservations for listings owned by the
//         currently logged-in host/admin
// @route  GET /api/reservations/host
// @access Private (host / admin)
// ─────────────────────────────────────────────────────────────
const getReservationsByHost = async (req, res) => {
  try {
    const reservations = await Reservation.find({ host: req.user._id })
      .populate('accommodation', 'title location images price')
      .populate('user', 'username email')
      .sort({ createdAt: -1 });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────
// @desc   Get all reservations made by the currently logged-in user
// @route  GET /api/reservations/user
// @access Private (any authenticated user)
// ─────────────────────────────────────────────────────────────
const getReservationsByUser = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id })
      .populate('accommodation', 'title location type images price')
      .sort({ createdAt: -1 });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────
// @desc   Delete (cancel) a reservation by ID
//         Only the booking owner, the listing's host, or an admin
//         may cancel a reservation.
// @route  DELETE /api/reservations/:id
// @access Private
// ─────────────────────────────────────────────────────────────
const deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Authorisation check: owner of booking, host of listing, or admin
    const isOwner = reservation.user.toString() === req.user._id.toString();
    const isHost  = reservation.host.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isHost && !isAdmin) {
      return res.status(403).json({ message: 'Not authorised to cancel this reservation' });
    }

    await reservation.deleteOne();
    res.json({ message: 'Reservation cancelled successfully' });
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
