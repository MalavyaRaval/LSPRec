require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");

mongoose.connect(config.connectionString);

const User = require("./models/user.model");
const Event = require("./models/event.model");

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { authenticationToken } = require("./utilities");

const app = express();
const router = express.Router();

app.use(express.json());
app.use(cors({ origin: "*" }));

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.status(401).json({ error: true, message: "Unauthorized" });
  }
};

app.get("/", (req, res) => {
  res.json({ data: "hello" });
});

// Create new Account
app.post("/create-account", async (req, res) => {
  const { fullName, email, password, address, address2, city, state, zip } =
    req.body;

  if (!fullName || !email || !password || !address || !city || !state || !zip) {
    return res
      .status(400)
      .json({ error: true, message: "All fields are required" });
  }

  const isUser = await User.findOne({ email });

  if (isUser) {
    return res
      .status(400)
      .json({ error: true, message: "User already exists" });
  }

  const user = new User({
    fullName,
    email,
    password, // Store password as plain text
    address,
    address2,
    city,
    state,
    zip,
  });

  await user.save();

  const accessToken = jwt.sign(
    { userId: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "3000m",
    }
  );

  return res.json({
    error: false,
    user,
    accessToken,
    message: "Registration Successful!",
  });
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: true, message: "Email and Password are required" });
  }

  const user = await User.findOne({ email });

  if (!user || user.password !== password) {
    return res
      .status(400)
      .json({ error: true, message: "Invalid credentials" });
  }

  const accessToken = jwt.sign(
    { userId: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "6000m",
    }
  );

  return res.json({
    error: false,
    message: "Login Successful",
    accessToken,
  });
});

// Get User
app.get("/get-user", authenticationToken, async (req, res) => {
  const userId = req.user.userId;

  console.log("User ID received from token:", userId); // Add this line for debugging

  try {
    const user = await User.findById(userId);

    if (!user) {
      console.log("User not found for ID:", userId); // Add this line for debugging
      return res.sendStatus(401);
    }

    console.log("User found:", user); // Add this line for debugging

    return res.json({
      user: {
        fullName: user.fullName,
        email: user.email,
        address: user.address,
        address2: user.address2,
        city: user.city,
        state: user.state,
        zip: user.zip,
        createdOn: user.createdOn,
      },
      message: "",
    });
  } catch (error) {
    console.error("Error retrieving user:", error); // Add this line for debugging
    return res.sendStatus(500);
  }
});

// Add Event
app.post("/add-event", authenticationToken, async (req, res) => {
  const {
    name,
    date,
    time,
    sponsor,
    coSponsor,
    security,
    food,
    custodian,
    description,
    image,
  } = req.body;
  const userId = req.user.userId;

  if (!name || !date || !description) {
    return res.status(400).json({
      error: true,
      message: "Name, Date, and Description are required",
    });
  }

  try {
    const event = new Event({
      name,
      date,
      time,
      sponsor,
      coSponsor,
      security,
      food,
      custodian,
      description,
      image,
      createdBy: userId, // Add the userId to the event
    });

    await event.save();

    return res.json({
      error: false,
      event,
      message: "Project added successfully",
    });
  } catch (error) {
    console.error("Error adding Project:", error);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// Edit Account
app.put("/edit-account", authenticationToken, async (req, res) => {
  const userId = req.user.userId; // Extracted from authentication token
  const { fullName, email, password, address, city, state, zip } = req.body;

  try {
    // Find the user by userId
    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    // Ensure only the authenticated user can edit their own account
    if (user._id.toString() !== userId) {
      return res.status(403).json({
        error: true,
        message: "Unauthorized to edit this user's account",
      });
    }

    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (password) user.password = password;
    if (address) user.address = address;
    if (city) user.city = city;
    if (state) user.state = state;
    if (zip) user.zip = zip;

    await user.save();

    return res.json({
      error: false,
      user,
      message: "User information updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// Get all Events
app.get("/get-all-events", async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    return res.json({
      error: false,
      events,
      message: "All events retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// Delete Event
app.delete("/delete-event/:eventId", authenticationToken, async (req, res) => {
  const eventId = req.params.eventId;

  try {
    const event = await Event.findOne({ _id: eventId });

    if (!event) {
      return res.status(404).json({ error: true, message: "Event not found" });
    }

    // Check if the event was created by the current user
    if (event.createdBy.toString() !== req.user.userId.toString()) {
      return res.status(403).json({
        error: true,
        message: "You do not have permission to delete this event",
      });
    }

    await Event.deleteOne({ _id: eventId });

    return res.json({
      error: false,
      message: "Event deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
