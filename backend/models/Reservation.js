/**
 * Reservation Model
 *
 * Stores a booking made by a user for a specific accommodation.
 * Pricing fields are snapshotted at booking time so that future
 * changes to the listing do not retroactively alter past reservations.
 *
 * Fields:
 *   accommodation  – ref to Accommodation document
 *   user           – ref to User who made the booking
 *   host           – ref to User who owns the listing (denormalised for fast host queries)
 *   checkIn        – arrival date
 *   checkOut       – departure date
 *   guests         – number of guests in the party
 *   nights         – pre-calculated duration (checkOut − checkIn in days)
 *   pricePerNight  – listing price at time of booking
 *   weeklyDiscount – discount percentage applied (0 if not applicable)
 *   cleaningFee    – cleaning fee at time of booking
 *   serviceFee     – service fee at time of booking
 *   occupancyTaxes – occupancy taxes at time of booking
 *   totalCost      – final calculated total
 *   status         – booking lifecycle state: pending | confirmed | cancelled
 */

const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    accommodation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Accommodation',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    checkIn:  { type: Date, required: true },
    checkOut: { type: Date, required: true },
    guests:   { type: Number, required: true, min: 1 },
    nights:   { type: Number, required: true, min: 1 },

    // Pricing snapshot — captured at booking time
    pricePerNight:   { type: Number, required: true, min: 0 },
    weeklyDiscount:  { type: Number, default: 0, min: 0 },
    cleaningFee:     { type: Number, default: 0, min: 0 },
    serviceFee:      { type: Number, default: 0, min: 0 },
    occupancyTaxes:  { type: Number, default: 0, min: 0 },
    totalCost:       { type: Number, required: true, min: 0 },

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'confirmed',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reservation', reservationSchema);
