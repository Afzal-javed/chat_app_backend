const bcrypt = require('bcrypt');
const Users = require('../models/users');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const loginUser = async (userId) => {
    // Update the user's online status to 'online' in the database
    await Users.findByIdAndUpdate(userId, { onlineStatus: 'online' });
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).send('Please fill all field correctly');
        } else {
            const user = await Users.findOne({ email });
            if (!user) {
                res.status(400).send('Invalid credential');
            } else {
                const validateUser = await bcrypt.compare(password, user.password);
                if (!validateUser) {
                    res.status(400).send('Invalid credential password');
                } else {
                    await loginUser(user._id);
                    const payload = {
                        userId: user.id,
                        email: user.email
                    }
                    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
                    jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: 84600 }, async (err, token) => {
                        await Users.updateOne({ _id: user._id }, {
                            $set: { token }
                        })
                        user.save();
                        return res.status(200).json({ user: { id: user._id, email: user.email, fullName: user.fullName, profilePicture: user.profilePicture }, token: token })
                    })
                }
            }
        }
    } catch (error) {
        console.log(error, "error")
    }
}

module.exports = login;