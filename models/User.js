// const mongoose = require('mongoose');

// const UserSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     resetPasswordToken: { type: String }, 
//     resetPasswordExpires: { type: Date }  
// });

// module.exports = mongoose.model('User', UserSchema);

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    contactNo: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
        required: true,
        validate: {
            validator: function(value) {
                return value === this.password; // Ensure confirmPassword matches password
            },
            message: "Passwords do not match."
        }
    },
    resetPasswordToken: { 
        type: String 
    }, 
    resetPasswordExpires: { 
        type: Date 
    }
});

module.exports = mongoose.model('User', UserSchema);
