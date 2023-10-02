const Conversations = require('../models/Conversation');
const Users = require('../models/users');
const conversationPost = async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;
        const newConversation = new Conversations({ members: [senderId, receiverId] });
        await newConversation.save();
        res.status(200).send('Conversation created successfully')
    } catch (error) {
        console.log(error, 'Error')
    }
}
const conversationGet = async (req, res) => {
    try {
        const userId = req.params.userId;
        const conversations = await Conversations.find({ members: { $in: [userId] } });
        const conversationUserData = await Promise.all(conversations.map(async (conversation) => {
            const receiverId = conversation.members.find((member) => member !== userId);
            const user = await Users.findById(receiverId);
            if (user) {
                return { user: { receiverId: user._id, email: user.email, fullName: user.fullName, profilePicture: user.profilePicture, userStatus: user.onlineStatus === 'online' ? user.onlineStatus : user.lastOnlineTime }, conversationId: conversation._id };
            }
            return null;
        }));
        const filteredConversationData = conversationUserData.filter(Boolean);
        res.status(200).json(filteredConversationData);
    } catch (error) {
        console.log(error, 'Error');
        res.status(500).json({ error: 'Internal server error' });
    }
}
module.exports = conversationPost
module.exports = conversationGet