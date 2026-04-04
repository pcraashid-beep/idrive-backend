const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  courseType: { type: Number, required: true }, 
  timeSlot: { type: String, required: true },
  scheduledDates: [{ type: String }], 
  startDate: { type: String, required: true }, 
  endDate: { type: String, required: true },   
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
