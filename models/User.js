const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }, 
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String }, // Add this field
    verificationExpires: { type: Date }, // Optional: to set an expiration time for the code
  
});

module.exports = mongoose.model('User', UserSchema);
