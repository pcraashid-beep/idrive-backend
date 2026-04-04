const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  courseType: { type: Number, required: true }, 
  // NEW: Every lesson is tracked individually
  itinerary: [{
    date: String,      // e.g., "2026-05-03"
    timeSlot: String   // e.g., "09:00 AM"
  }],
  startDate: String,
  endDate: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);