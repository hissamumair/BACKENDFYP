const User = require('../models/User');

// Get User Profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error });
    }
};

// Update User Profile
exports.updateProfile = async (req, res) => {
    const { name, email } = req.body;

    try {
        const user = await User.findByIdAndUpdate(req.user.id, { name, email }, { new: true }).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error });
    }
};
