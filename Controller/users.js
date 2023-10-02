const Users = require('../models/users');

const users = async (req, res) => {
    try {
        const userId = req.params.userId
        const users = await Users.find({ _id: { $ne: userId } });
        const userData = Promise.all(users.map(async (user) => {
            return { user: { profilePicture: user.profilePicture, email: user.email, fullName: user.fullName, receiverId: user._id } }
        }))
        res.status(200).json(await userData);
    } catch (error) {
        console.log(error, 'Error');
    }
}
module.exports = users