const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Import our new blueprint
const Booking = require('./models/Booking'); 

const app = express();

app.use(cors()); 
app.use(express.json()); 

// Database Connection (Added { family: 4 } to force IPv4)
mongoose.connect(process.env.MONGO_URI, { family: 4 })
  .then(() => console.log("Connected to MongoDB successfully!"))
  .catch((err) => console.log("MongoDB connection error: ", err));
// --- API ROUTES ---

// 1. Test Route
app.get('/api/test', (req, res) => {
  res.json({ message: "Hello from the iDrive Backend!" });
});

// 2. Route to Fetch all Bookings (The "Read" Route)
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find(); // Fetches everything in the collection
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// 3. Route to Save a Booking (The "Create" Route)
app.post('/api/bookings', async (req, res) => {
  try {
    // req.body contains the data sent from React (now including the scheduledDates array)
    const newBooking = new Booking(req.body); 
    
    // Save it to MongoDB
    const savedBooking = await newBooking.save(); 
    
    // Send a success message back to React
    res.status(201).json({ message: "Booking successfully saved!", booking: savedBooking });
  } catch (error) {
    console.error("Error saving booking:", error);
    res.status(500).json({ error: "Failed to save booking" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});