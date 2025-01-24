const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');  // Import cors package



// Import route files
const userRoutes = require("./routes/userRoutes");
const placeRoutes = require("./routes/place");
const campingRoutes = require('./routes/camping');
const reviewRoutes = require('./routes/reviews'); // Include the review routes
const gadgetRoutes = require('./routes/gadget');
const hikingRoutes = require('./routes/hicking');
const safetyEquipmentRoutes = require('./routes/safetyEquipmentRoutes');
const weatherRoutes = require('./routes/weather');
const chatRoutes = require('./routes/messageRoutes'); // Import chat routes
const bookingRoutes = require('./routes/bookingRoutes'); // Import booking routes
const carBookingRoutes = require('./routes/carBookingRoutes'); // Import car booking routes

const app = express();
app.use(cors()); // This allows all origins by default

// Connect to MongoDB
mongoose.connect('mongodb+srv://hissam123:hissam123@cluster0.yho26.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

// Middleware
app.use(express.json()); // For parsing application/json

app.get("/", (req, res) => {
  res.status(200).send("Hello World from MH Expedition System");
});

// Routes
app.use("/api/user", userRoutes); 
app.use("/api/place", placeRoutes); 
app.use('/api/camping', campingRoutes);
app.use('/api/reviews', reviewRoutes); // Add review routes
app.use('/api/gadgets', gadgetRoutes); 
app.use('/api/hiking', hikingRoutes); 
app.use('/api/safety-equipment', safetyEquipmentRoutes); 
app.use('/api/weather', weatherRoutes); 
app.use('/api/chat', chatRoutes); // Add chat routes
app.use('/api/booking', bookingRoutes); // Add booking routes
app.use('/api/car-booking', carBookingRoutes); // Add car booking routes

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

