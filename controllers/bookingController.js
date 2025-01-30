const Booking = require('../models/Booking');
const nodemailer = require("nodemailer");

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "hissamyousafzai@gmail.com",
    pass: "qgyb elnu ggex uaqb",
  },
});

// Get all bookings (no filter)
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();  // Get all bookings from the database
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all bookings for a specific user
exports.getAllBookingsForUser = async (req, res) => {
  try {
    const userId = req.params.userId;  // Extract userId from the URL parameters

    // Query to find bookings for the user with the given userId
    const bookings = await Booking.find({ user: userId });

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: 'No bookings found for this user.' });
    }

    res.status(200).json(bookings);  // Return the bookings for the user
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new booking
exports.createBooking = async (req, res) => {
  const { startDate, endDate, deposit, status, user, contactNumber, gender, email, fullName } = req.body;
  console.log("object, ", req.body);
  const booking = new Booking(req.body);

  try {
    const newBooking = await booking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a booking by ID
exports.updateBooking = async (req, res) => {
  const { 
    startDate, 
    endDate, 
    deposit, 
    status, 
    user, 
    contactNumber, 
    gender, 
    email, 
    fullName,
    paymentScreenshot, 
    carName,
    assignedCarName // Add the assigned car name field
  } = req.body;

  try {
    console.log("object", req.body);

    // Update booking
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { 
        startDate, 
        endDate, 
        deposit, 
        status, 
        user, 
        contactNumber, 
        gender, 
        email, 
        fullName,
        paymentScreenshot, 
        carName,
      },
      { new: true }
    );

    // Send confirmation email if booking is completed
    if (booking && status === "Completed") {
      const mailOptions = {
        from: "hissamyousafzai@gmail.com",
        to: email,
        subject: "Exciting News! Your Booking Has Been Approved ✅",
        html: `
        <p>Dear ${fullName},</p>
        <p>We are pleased to inform you that your booking has been successfully approved!</p>
      
        <h3>Booking Details:</h3>
        <ul>
          <li>Booking Status: Completed</li>
        </ul>
      
        <h3>Car Model Assignment:</h3>
        <p>${carName ? 
          `Your assigned car model is ${carName}.` :
          `We have not yet assigned a car model to your booking. Please feel free to contact us via email if you have a specific car model request.`}
        </p>
      
        <h3>Next Steps:</h3>
        <ol>
          <li>Review the booking confirmation details above.</li>
          <li>Prepare for your upcoming tour.</li>
          <li>Contact our customer service if you have any questions or car preferences.</li>
        </ol>
      
        <p>Thank you for choosing our service. We look forward to providing you with an exceptional rental experience.</p>
      
        <p>Best regards,<br>
        MH Expedition Team</p>
      `
        }      

      try {
        await transporter.sendMail(mailOptions);
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Optionally, you might want to handle email sending failures
      }
    }

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    res.status(200).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a booking by ID
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
