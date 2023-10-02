const mongoose = require('mongoose');
const userScheema = mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: "https://img.icons8.com/ios-glyphs/30/user--v1.png", // Provide a default profile picture URL
    },
    token: {
        type: String
    },
    onlineStatus: { type: String, default: 'offline' }, // 'online' or 'offline'
    lastOnlineTime: { type: String, default: null }
});

const Users = mongoose.model('User', userScheema);
module.exports = Users;