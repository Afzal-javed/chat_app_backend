const Users = require('../models/users');

const deleteUser = async (req, res) => {
    const userId = req.params.userId;
    try {
        const deleteUser = await Users.findByIdAndDelete({ _id: userId });
        res.status(200).json(deleteUser);
    } catch (error) {
        res.status(500).send('Internal server error')
    }
}
module.exports = deleteUser