const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  courseType: { type: Number, required: true }, // Will be 10, 15, or 22
  timeSlot: { type: String, required: true },
  
  // NEW: Fields for the Smart-Fill Logic
  scheduledDates: [{ type: String }], // Array of specific dates they are driving (e.g., ["1", "2", "4"...])
  startDate: { type: String, required: true }, // The first day of their course
  endDate: { type: String, required: true },   // The final day of their course
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);