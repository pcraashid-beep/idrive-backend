const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const Booking = require('./models/Booking');

const app = express();

app.use(cors({
  origin: 'https://idrive-portal.onrender.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors()); 
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB!"))
  .catch(err => console.log("DB Connection Error: ", err));

// 1. PUBLIC: Check Availability (Only sends dates/times, no private data)
app.get('/api/availability', async (req, res) => {
  try {
    const bookings = await Booking.find({}, 'itinerary');
    const allBusySlots = bookings.flatMap(b => b.itinerary || []);
    res.json(allBusySlots);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch availability" });
  }
});

// 2. PUBLIC: Save New Booking
app.post('/api/bookings', async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    const saved = await newBooking.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// --- NEW ADMIN ROUTES -------------------------------
// ----------------------------------------------------

// 3. ADMIN: Get ALL Booking Details (Names, phones, statuses)
app.get('/api/admin/bookings', async (req, res) => {
  try {
    // Sorts by newest first
    const bookings = await Booking.find().sort({ createdAt: -1 }); 
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch admin data" });
  }
});

// 4. ADMIN: Update a Booking (Assigning a trainer)
app.put('/api/admin/bookings/:id', async (req, res) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id, 
      { 
        trainer: req.body.trainer,
        status: req.body.status 
      }, 
      { new: true } // Returns the updated document
    );
    res.status(200).json(updatedBooking);
  } catch (err) {
    res.status(500).json({ error: "Failed to update booking" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));