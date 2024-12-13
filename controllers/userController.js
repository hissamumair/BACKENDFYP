const bcrypt = require("bcryptjs");
const crypto = require("crypto"); // For generating tokens
const User = require("../models/User");
// import jwt from 'jsonwebtoken';
const nodemailer = require('nodemailer');

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "hissamyousafzai@gmail.com",
    pass: "qgyb elnu ggex uaqb"
  }
});

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Register a new user
exports.register = async (req, res) => {
  const { name, email, contactNo, password, confirmPassword } = req.body;

  // if (password !== confirmPassword) {
  //   return res.status(400).json({ message: "Passwords do not match." });
  // }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      contactNo,
      password: hashedPassword,
      confirmPassword: hashedPassword, // Save hashed confirmPassword for consistency
    });
    const user = await newUser.save();
    res.status(201).json({ message: "User registered successfully!", user });
  } catch (error) {
    res.status(400).json({ message: "Error registering user", error });
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
    const hashedOTP = crypto
      .createHash('sha256')
      .update(otp)
      .digest('hex');

    // Set OTP and expiration in user document
    user.resetPasswordToken = hashedOTP;
    user.resetPasswordExpires = Date.now() + 600000; // 10 minutes
    await user.save();

 
    // Create email template
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Password Reset OTP',
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
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ 
      message: "OTP has been sent to your email",
      email: email,
      expiresIn: "10 minutes"
    });

  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ 
      message: "Error processing password reset request",
      error: error.message 
    });
  }
};

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ 
      email,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        message: "OTP has expired or user not found" 
      });
    }

    // Hash received OTP and compare
    const hashedOTP = crypto
      .createHash('sha256')
      .update(otp)
      .digest('hex');

    if (hashedOTP !== user.resetPasswordToken) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // OTP is valid - generate temporary token for password reset
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Save new reset token
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 300000; // 5 minutes to reset password
    await user.save();

    res.status(200).json({ 
      message: "OTP verified successfully",
      resetToken: resetToken
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ 
      message: "Error verifying OTP",
      error: error.message 
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

    const user = await User.findById(userId)
      .select('-password') 

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
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
        updatedAt: user.updatedAt
      }
    });

  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: "Error fetching user details",
      error: error.message
    });
  }
};


