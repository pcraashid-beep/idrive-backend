const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const Booking = require('./models/Booking');

const app = express();

// 1. Allow your frontend to talk to this backend
app.use(cors()); 
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB!"))
  .catch(err => console.log("DB Connection Error: ", err));

// --- NEW ROUTE: Check for busy slots ---
app.get('/api/availability', async (req, res) => {
  try {
    const bookings = await Booking.find({}, 'itinerary');
    // We send back all booked dates and times so the frontend can find conflicts
    const allBusySlots = bookings.flatMap(b => b.itinerary || []);
    res.json(allBusySlots);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch availability" });
  }
});

// --- UPDATED POST ROUTE ---
app.post('/api/bookings', async (req, res) => {
  try {
    console.log("New Booking Received:", req.body);
    const newBooking = new Booking(req.body);
    const saved = await newBooking.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Save Error:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));