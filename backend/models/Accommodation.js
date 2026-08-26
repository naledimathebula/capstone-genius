/**
 * Accommodation Model
 *
 * Represents a property listing in the Airbnb clone.
 * All pricing fields default to 0 so the cost calculator never
 * encounters undefined values when computing totals.
 *
 * Fields:
 *   title            – listing headline
 *   location         – city / area name (used for filtering)
 *   description      – full listing description
 *   type             – e.g. "Entire apartment", "Private room"
 *   bedrooms         – number of bedrooms (≥ 0)
 *   bathrooms        – number of bathrooms (≥ 0)
 *   guests           – maximum guest capacity (≥ 1)
 *   amenities        – array of amenity strings (e.g. "wifi", "kitchen")
 *   images           – array of image URL strings
 *   price            – nightly rate in USD
 *   weeklyDiscount   – percentage discount for stays of 7+ nights (0-100)
 *   cleaningFee      – one-time cleaning fee in USD
 *   serviceFee       – platform service fee in USD
 *   occupancyTaxes   – local occupancy taxes in USD
 *   rating           – average star rating (0-5, set manually or via reviews)
 *   reviews          – total number of reviews
 *   specificRatings  – breakdown: cleanliness, communication, checkIn,
 *                      accuracy, location, value (each 0-5)
 *   enhancedCleaning – host committed to enhanced cleaning protocol
 *   selfCheckIn      – property supports self check-in
 *   host             – reference to the User who owns this listing
 */

const mongoose = require('mongoose');

const accommodationSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    location:    { type: String, required: true, trim: true },
    description: { type: String, required: true },
    type:        { type: String, required: true },
    bedrooms:    { type: Number, required: true, min: 0 },
    bathrooms:   { type: Number, required: true, min: 0 },
    guests:      { type: Number, required: true, min: 1 },
    amenities:   { type: [String], default: [] },
    images:      { type: [String], default: [] },
    price:       { type: Number, required: true, min: 0 },

    // Pricing extras — all default to 0 so calculations are always valid
    weeklyDiscount:  { type: Number, default: 0, min: 0, max: 100 },
    cleaningFee:     { type: Number, default: 0, min: 0 },
    serviceFee:      { type: Number, default: 0, min: 0 },
    occupancyTaxes:  { type: Number, default: 0, min: 0 },

    // Review / rating data
    rating:   { type: Number, default: 0, min: 0, max: 5 },
    reviews:  { type: Number, default: 0, min: 0 },
    specificRatings: {
      cleanliness:   { type: Number, default: 0, min: 0, max: 5 },
      communication: { type: Number, default: 0, min: 0, max: 5 },
      checkIn:       { type: Number, default: 0, min: 0, max: 5 },
      accuracy:      { type: Number, default: 0, min: 0, max: 5 },
      location:      { type: Number, default: 0, min: 0, max: 5 },
      value:         { type: Number, default: 0, min: 0, max: 5 },
    },

    // Feature flags
    enhancedCleaning: { type: Boolean, default: false },
    selfCheckIn:      { type: Boolean, default: false },

    // Ownership
    host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Accommodation', accommodationSchema);
