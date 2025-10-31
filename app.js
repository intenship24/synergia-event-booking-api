require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Booking = require("./models/Booking");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err.message));

// ----------------------------------
// Routes
// ----------------------------------

// Root
app.get("/", (req, res) => {
  res.send("🎉 Synergia Event Booking API (MongoDB)");
});

/*
1) GET /api/bookings - Get all bookings
    - optional query parameters could be added later (pagination, sort)
*/
app.get("/api/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    return res.status(200).json(bookings);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});


app.post("/api/bookings", async (req, res) => {
  try {
    const { name, email, event, ticketType } = req.body;
    if (!name || !email || !event) {
      return res.status(400).json({ message: "Name, email, and event are required." });
    }

    const booking = new Booking({ name, email, event, ticketType });
    const saved = await booking.save();
    return res.status(201).json({ message: "Booking created successfully!", booking: saved });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

/*
3) GET /api/bookings/:id - Get booking by ID
*/
app.get("/api/bookings/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found!" });
    return res.status(200).json(booking);
  } catch (err) {
    // invalid ObjectId or other error
    return res.status(400).json({ message: "Invalid ID or server error", error: err.message });
  }
});

/*
4) PUT /api/bookings/:id - Update participant details (partial allowed)
*/
app.put("/api/bookings/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;
    const updated = await Booking.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: "Booking not found!" });
    return res.status(200).json({ message: "Booking updated successfully!", booking: updated });
  } catch (err) {
    return res.status(400).json({ message: "Invalid request or server error", error: err.message });
  }
});

/*
5) DELETE /api/bookings/:id - Delete/cancel booking
*/
app.delete("/api/bookings/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Booking.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Booking not found!" });
    return res.status(200).json({ message: "Booking cancelled successfully!" });
  } catch (err) {
    return res.status(400).json({ message: "Invalid ID or server error", error: err.message });
  }
});

/*
6) GET /api/bookings/search?email=xyz  - Search booking by email (partial/case-insensitive)
*/
app.get("/api/bookings/search", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Query param 'email' is required" });
    const results = await Booking.find({ email: new RegExp(email, "i") });
    return res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

/*
7) GET /api/bookings/filter?event=Synergia - Filter by event name (partial/case-insensitive)
*/
app.get("/api/bookings/filter", async (req, res) => {
  try {
    const { event } = req.query;
    if (!event) return res.status(400).json({ message: "Query param 'event' is required" });
    const results = await Booking.find({ event: new RegExp(event, "i") });
    return res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// fallback 404 for unknown API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({ message: "API endpoint not found" });
});

// Start
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
