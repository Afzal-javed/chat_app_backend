const mongoose = require('mongoose');

const conversationScheema = mongoose.Schema({
    members: {
        type: Array,
        required: true
    }
});

const Conversation = mongoose.model('Conversation', conversationScheema);
module.exports = Conversation;