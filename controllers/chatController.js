// controllers/chatController.js
const Chat = require('../models/Chat'); // Ensure the Chat model is correctly imported

// Get chat history
exports.getChatHistory = async (req, res) => {
  try {
    const chats = await Chat.find();
    res.json(chats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Post a new message
exports.postMessage = async (req, res) => {
  const newMessage = new Chat({
    message: req.body.message,
    user: req.body.user, // Add additional fields as required
  });

  try {
    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

// Update a message by ID (if you want to include this as well)
exports.updateMessage = async (req, res) => {
  try {
    const updatedMessage = await Chat.findByIdAndUpdate(
      req.params.id,
      { message: req.body.message },
      { new: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json(updatedMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
