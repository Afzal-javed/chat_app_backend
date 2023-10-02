const Conversations = require('../models/Conversation');
const Messages = require('../models/Messages');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'didaqbzlw',
    api_key: '546235265583292',
    api_secret: '9j7T55ryefqcnjsSaaCWt7WzWhQ'
});

const messagesPost = async (req, res) => {
    try {
        const { conversationId, senderId, messageType, message, receiverId = '' } = req.body;
        let photoUrl = '';
        let newConversationId = conversationId;
        if (messageType === 'image') {
            if (req.file) {
                const uploadResult = await cloudinary.uploader.upload(req.file.path);
                photoUrl = uploadResult.secure_url;
            } else {
                return res.status(400).send('Image message requires a photo.');
            }
        } else if (messageType === 'text') {
            if (!message) {
                return res.status(400).send('Text message content is required.');
            }
        } else {
            return res.status(400).send('Invalid message type.');
        }
        if (!senderId) {
            return res.status(400).send('Sender ID is required.');
        }
        if (newConversationId === 'new' && receiverId) {
            const newConversation = new Conversations({ members: [senderId, receiverId] });
            await newConversation.save();
            newConversationId = newConversation._id;
            const newMessageData = {
                conversationId: newConversation._id,
                senderId,
                messageType,
                message,
                imageUrl: photoUrl,
            };
            const newMessage = new Messages(newMessageData);
            await newMessage.save();
        } else if (!newConversationId && !receiverId) {
            return res.status(400).send('Please fill all required fields.');
        } else {
            const newMessageData = {
                conversationId: newConversationId,
                senderId,
                messageType,
                message,
                imageUrl: photoUrl,
            };
            const newMessage = new Messages(newMessageData);
            await newMessage.save();
        }

        return res.status(200).send('Message sent successfully');
    } catch (error) {
        console.log(error, 'Error');
        res.status(500).send('Internal server error');
    }
}

module.exports = messagesPost