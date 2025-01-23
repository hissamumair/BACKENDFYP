const bcrypt = require("bcryptjs");
const crypto = require("crypto"); // For generating tokens
const User = require("../models/User");
const Booking = require("../models/Booking");
const CarBooking = require("../models/CarBooking");
const Place = require("../models/place");
const Review = require("../models/review");
const mongoose = require("mongoose");
// import jwt from 'jsonwebtoken';
const nodemailer = require("nodemailer");

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "hissamyousafzai@gmail.com",
    pass: "qgyb elnu ggex uaqb",
  },
});

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users
    res.status(200).json({ success: true, users });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch users",
        error: error.message,
      });
  }
};

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Register a new user
exports.register = async (req, res) => {
  const { name, email, contactNo, password, confirmPassword } = req.body;
  console.log("object", req.body);
  // if (password !== confirmPassword) {
  //   return res.status(400).json({ message: "Passwords do not match." });
  // }

  try {
    const hashedPassword = await bcrypt.hash(password || "123456", 10);
    // Generate a 4-digit verification code
    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      confirmPassword: hashedPassword, // Save hashed confirmPassword for consistency
      role: "user",
      verificationCode,
      verificationExpires: new Date(Date.now() + 15 * 60 * 1000), // Code expires in 15 minutes
    });

    // Send the verification email
    const mailOptions = {
      from: "hissamyousafzai@gmail.com",
      to: email,
      subject: "Your Verification Code",
      text: `Your 4-digit verification code is: ${verificationCode}`,
    };

    await transporter.sendMail(mailOptions);

    const user = await newUser.save();

    res.status(201).json({ message: "User registered successfully!", user });
  } catch (error) {
    console.log("object", error);
    res.status(400).json({ message: "Error registering user", error });
  }
};

exports.verifyEmail = async (req, res) => {
  const { email, code } = req.body;
console.log("asdf",email,typeof code)
  try {
    // Find the user by email
    const user = await User.findOne({ email });
console.log("object",user)
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if the verification code matches and is not expired
    if (
      user.verificationCode == code &&
      user.verificationExpires > Date.now()
    ) {
      // Mark the user as verified and remove the verification code
      user.isVerified = true;
      user.verificationCode = undefined;
      user.verificationExpires = undefined;
      await user.save();

      return res.status(200).json({ message: 'Email verified successfully!', user });
    }

    res.status(400).json({ message: 'Invalid or expired verification code.' });
  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({ message: 'Error verifying email', error });
  }
};

// User login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // Create JWT token
    // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ userId: user._id, user });
  } catch (error) {
    console.log("object", error);
    res.status(500).json({ message: "Error logging in", error });
  }
};

// Forget password (Generate reset token)
exports.forget = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate OTP
    const otp = generateOTP();

    // Hash OTP before saving
    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

    // Set OTP and expiration in user document
    user.resetPasswordToken = hashedOTP;
    user.resetPasswordExpires = Date.now() + 600000; // 10 minutes
    await user.save();

    // Create email template
    const mailOptions = {
      from: "hissamyousafzai@gmail.com",
      to: email,
      subject: "Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>You have requested to reset your password. Please use the following OTP code to proceed with your password reset:</p>
          <div style="background-color: #f4f4f4; padding: 15px; margin: 20px 0; text-align: center;">
            <h1 style="color: #0066cc; letter-spacing: 5px; font-size: 32px;">${otp}</h1>
          </div>
          <p>This OTP will expire in 10 minutes.</p>
          <p style="color: #666; font-size: 14px;">If you didn't request this password reset, please ignore this email or contact support if you have concerns.</p>
          <p style="color: #666; font-size: 14px;">For security reasons, please don't share this OTP with anyone.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "OTP has been sent to your email",
      email: email,
      expiresIn: "10 minutes",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({
      message: "Error processing password reset request",
      error: error.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ success: false, message: "Invalid user ID" });
  }

  try {
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Delete all related records
    await Booking.deleteMany({ userId });
    await CarBooking.deleteMany({ userId });

    // Remove user record
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "User and related records deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params; // Extract user ID from request params
    const updateFields = req.body; // Get fields to update from the request body

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (!Object.keys(updateFields).length) {
      return res.status(400).json({ message: "No fields to update provided" });
    }

    // Find the user by ID and update the provided fields
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, runValidators: true } // Return the updated document and validate fields
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({
      email,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "OTP has expired or user not found",
      });
    }

    // Hash received OTP and compare
    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

    if (hashedOTP !== user.resetPasswordToken) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // OTP is valid - generate temporary token for password reset
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Save new reset token
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 300000; // 5 minutes to reset password
    await user.save();

    res.status(200).json({
      message: "OTP verified successfully",
      resetToken: resetToken,
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({
      message: "Error verifying OTP",
      error: error.message,
    });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params; // Extract token from URL
  const { password } = req.body; // Get new password and confirmation

  // Check if password and confirmPassword match
  if (!password) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    // Find the user by reset token and ensure the token is still valid (not expired)
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Ensure token is not expired
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password and clear reset token and expiration
    user.password = hashedPassword;
    user.resetPasswordToken = undefined; // Clear the token
    user.resetPasswordExpires = undefined; // Clear the expiration time

    // Save the updated user record
    await user.save();

    res.status(200).json({ message: "Password has been reset successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error resetting password", error });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage,
        addresses: user.addresses,
        orders: user.orders,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user details",
      error: error.message,
    });
  }
};

// Function to get the dashboard data
exports.getDashboardData = async (req, res) => {
  try {
    // 1. Total Users & User Statistics
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: "active" });

    // 2. Total Bookings & Booking Statistics
    const totalBookings = await Booking.countDocuments();
    const totalCarBookings = await CarBooking.countDocuments();

    // 3. Total Revenue (Summing up confirmed bookings' deposits)
    const totalRevenue = await Booking.aggregate([
      { $match: { status: "Confirmed" } },
      { $group: { _id: null, total: { $sum: "$deposit" } } },
    ]);
    const revenue = totalRevenue[0] ? totalRevenue[0].total : 0;

    // 4. Total Places & Reviews
    const totalPlaces = await Place.countDocuments();
    const totalReviews = await Review.countDocuments();

    // Prepare the dashboard data as requested
    const dashboardData = [
      {
        title: "Total Users",
        value: totalUsers.toLocaleString(), // Format the value with commas
        gradient: "bg-gradient-to-r from-blue-500 to-indigo-600",
      },
      // {
      //   title: "Total Revenue",
      //   value: `$${revenue.toLocaleString()}`, // Format revenue as currency
      //   gradient: "bg-gradient-to-r from-green-500 to-teal-500",
      // },
      // {
      //   title: "Total Expeditions",
      //   value: "320", // This can be a static value or another dynamic value if needed
      //   gradient: "bg-gradient-to-r from-yellow-400 to-orange-500",
      // },
      {
        title: "Total Bookings",
        value: totalBookings.toLocaleString(),
        gradient: "bg-gradient-to-r from-red-500 to-pink-500",
      },
      {
        title: "Total Car Bookings",
        value: totalCarBookings.toLocaleString(),
        gradient: "bg-gradient-to-r from-purple-500 to-pink-600",
      },
      // {
      //   title: "Trip Bookings",
      //   value: "1,200", // This can be another dynamic value (e.g., from bookings related to trips)
      //   gradient: "bg-gradient-to-r from-indigo-500 to-purple-600",
      // },
      // {
      //   title: "Statistics",
      //   value: "80%", // Placeholder, you can calculate a specific statistic like completion rate
      //   gradient: "bg-gradient-to-r from-teal-500 to-cyan-500",
      // },
    ];

    // Respond with the formatted dashboard data
    res.status(200).json(dashboardData);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Error fetching dashboard data", error });
  }
};
