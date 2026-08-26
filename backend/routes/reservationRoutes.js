/**
 * Reservation Routes
 *
 * All routes are protected — the user must be authenticated.
 *
 *   POST   /api/reservations        – create a reservation
 *   GET    /api/reservations/host   – host's incoming reservations
 *   GET    /api/reservations/user   – current user's reservations
 *   DELETE /api/reservations/:id    – cancel a reservation
 *
 * Note: /host and /user static segments are declared before /:id
 * to avoid Express matching them as the id parameter.
 */

const express = require('express');
const router  = express.Router();
const {
  createReservation,
  getReservationsByHost,
  getReservationsByUser,
  deleteReservation,
} = require('../controllers/reservationController');
const { protect } = require('../middleware/auth');

router.post('/',        protect, createReservation);
router.get('/host',     protect, getReservationsByHost);
router.get('/user',     protect, getReservationsByUser);
router.delete('/:id',   protect, deleteReservation);

module.exports = router;
