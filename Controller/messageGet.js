const Conversations = require('../models/Conversation');
const Messages = require('../models/Messages');
const Users = require('../models/users');
const moment = require('moment-timezone');
const messagesGet = async (req, res) => {
    try {
        const checkMessages = async (conversationId) => {
            const messages = await Messages.find({ conversationId });
            const messageUserData = await Promise.all(messages.map(async (message) => {
                const localtimeStamp = moment(message.createdAt).tz(message.timezone).format('LT');
                const user = await Users.findById(message.senderId);
                return { user: { id: user._id, email: user.email, fullName: user.fullName, profilePicture: user.profilePicture }, message: message.message, image: message.imageUrl, time: localtimeStamp }
            }));
            res.status(200).json(messageUserData);
        }
        const conversationId = req.params.conversationId;
        if (conversationId === 'new') {
            const checkConversation = await Conversations.find({ members: { $all: [req.query.senderId, req.query.receiverId] } })
            if (checkConversation.length > 0) {
                checkMessages(checkConversation[0]._id);
            } else {
                return res.status(200).json([]);
            }
        } else {
            checkMessages(conversationId);
        }
    } catch (error) {
        console.log(error, 'Error')
    }
}
module.exports = messagesGet