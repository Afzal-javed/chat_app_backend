const Users = require('../models/users');
const moment = require('moment-timezone');
const logoutUser = async (userId) => {
    const lastOnlineTime = moment().format('LT');
    await Users.findByIdAndUpdate(userId, { onlineStatus: 'offline', lastOnlineTime });
};
const logout = async (req, res) => {
    const userId = req.params.userId;
    const user = await Users.findById(userId);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    user.token = '';
    await logoutUser(userId);
    await user.save();

    res.status(200).json({ message: 'User logged out successfully' });
}
module.exports = logout