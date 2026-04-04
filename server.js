const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const Booking = require('./models/Booking');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB!"))
  .catch(err => console.log(err));

// Get all itineraries to check for overlaps
app.get('/api/availability', async (req, res) => {
  try {
    const bookings = await Booking.find({}, 'itinerary');
    // Flatten all booked slots into one simple array for the frontend to check
    const allBusySlots = bookings.flatMap(b => b.itinerary);
    res.json(allBusySlots);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/api/bookings', async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    await newBooking.save();
    res.status(201).json({ message: "Success" });
  } catch (err) {
    res.status(500).send(err);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));