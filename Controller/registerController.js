const bcrypt = require('bcrypt');
const Users = require('../models/users');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'didaqbzlw',
    api_key: '546235265583292',
    api_secret: '9j7T55ryefqcnjsSaaCWt7WzWhQ'
});
const register = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password) {
            return res.status(400).send('Please fill in all required fields');
        }
        const isAlreadyExist = await Users.findOne({ email });
        if (isAlreadyExist) {
            return res.status(400).send('User already exists');
        }
        const profilePicture = req.file;
        // if (!profilePicture) {
        //     return res.status(400).send('Please upload a profile picture');
        // }
        if (profilePicture) {
            const uploadResult = await cloudinary.uploader.upload(profilePicture.path);
            const newUser = new Users({
                fullName,
                email,
                profilePicture: uploadResult.secure_url
            });
            bcrypt.hash(password, 10, (err, hashedPassword) => {
                if (err) {
                    return res.status(500).send('Error hashing the password');
                }
                newUser.set('password', hashedPassword);
                newUser.save();
                return res.status(200).send({ msg: 'User register successfully' });
            });
        } else {
            const newUser = new Users({
                fullName,
                email,
            });
            bcrypt.hash(password, 10, (err, hashedPassword) => {
                if (err) {
                    return res.status(500).send('Error hashing the password');
                }
                newUser.set('password', hashedPassword);
                newUser.save();
                return res.status(200).send({ msg: 'User register successfully' });
            });
        }
    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).send('Internal server error');
    }
}
module.exports = register;