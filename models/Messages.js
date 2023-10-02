const mongoose = require('mongoose');
const moment = require('moment-timezone');
const messageScheema = mongoose.Schema({
    conversationId: {
        type: String
    },
    senderId: {
        type: String
    },
    // message: {
    //     type: String
    // }
    messageType: {
        type: String, // 'text' for text messages, 'image' for image messages
        enum: ['text', 'image'],
        default: 'text', // Default to text messages
    },
    message: {
        type: String, // For text messages
        required: function () {
            // Content is required for text messages
            return this.messageType === 'text';
        },
    },
    imageUrl: {
        type: String, // For image messages, store the URL of the image
        required: function () {
            // Image URL is required for image messages
            return this.messageType === 'image';
        },
    },
    timezone: {
        type: String,
        default: 'Asia/Kolkata', // Default to Indian Standard Time (IST)
    },

}, { timestamps: true });
moment.tz.setDefault('Asia/Kolkata');

const Messages = mongoose.model('Message', messageScheema);
module.exports = Messages;