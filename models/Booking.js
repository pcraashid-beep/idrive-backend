const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  courseType: { type: Number, required: true }, 
  itinerary: [{
    date: String,      
    timeSlot: String   
  }],
  startDate: String,
  endDate: String,
  // --- NEW ADMIN FIELDS ---
  status: { type: String, default: "Unassigned" }, 
  trainer: { type: String, default: "Pending" },
  // ------------------------
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);