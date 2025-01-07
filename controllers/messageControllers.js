

  
// };
const Chat = require('../models/messageModel');
const User = require('../models/User');

// Send a Message
exports.sendMessage = async (req, res) => {
  const { receiver, message,sender } = req.body;

  try {
    const newMessage = new Chat({
      sender,
      receiver,
      message,

    });

    await newMessage.save();

    res.status(201).json({ 
      success: true, 
      message: 'Message sent successfully!', 
      newMessage 
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ 
      success: false, 
      message: 'Error sending message', 
      error: error.message 
    });
  }
};

// Get All Messages
exports.getMessages = async (req, res) => {
  const {senderId,receiverId} = req.params;

  try {
    const messages = await Chat.find({sender:senderId, receiver:receiverId})
      .populate('sender', 'name') // Replace 'name' with actual fields in your User model
      .populate('receiver', 'name') // Replace 'name' with actual fields in your User model
      .sort({ createdAt: -1 }); // Sort messages by newest first

    res.status(200).json({ 
      success: true, 
      messages 
    });
  } catch (error) {
    console.error("Error retrieving messages:", error);
    res.status(500).json({ 
      success: false, 
      message: 'Error retrieving messages', 
      error: error.message 
    });
  }
};

// Get All Users who have messages with admin, excluding the admin
exports.getUsersWithAdminMessages = async (req, res) => {
  const adminId = '677d009c7ac603591cd27c49'; // Replace this with the actual admin's ID

  try {
    // Find all messages where the sender or receiver is the admin
    const usersInvolved = await Chat.find({
      $or: [
        { sender: adminId },
        { receiver: adminId }
      ]
    })
    .select('sender receiver') // Select only sender and receiver fields
    .exec()

    // Extract unique sender and receiver IDs
    const userIds = [
      ...new Set(usersInvolved.map(message => message.sender)),
      ...new Set(usersInvolved.map(message => message.receiver)),
    ];

    // Remove adminId from the userIds list
    const filteredUserIds = userIds.filter(userId => userId.toString() !== adminId);

    // Fetch user details only once for each unique user ID, excluding the admin
    const users = await User.find({
      _id: { $in: filteredUserIds } // Query for users by the unique IDs, excluding admin
    });

    // Return the list of unique users who have messages with the admin
    res.status(200).json({
      success: true,
      users
    });
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving users',
      error: error.message
    });
  }
};

