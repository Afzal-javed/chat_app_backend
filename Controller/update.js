const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary').v2;
const Users = require('../models//users');
cloudinary.config({
    cloud_name: 'didaqbzlw',
    api_key: '546235265583292',
    api_secret: '9j7T55ryefqcnjsSaaCWt7WzWhQ'
});
const update = async (req, res) => {
    const userId = req.params.userId;
    if (!userId) {
        return res.status(400).send('Invalid user ID');
    }
    const { fullName, email, password } = req.body;
    const profilePicture = req.file;
    try {
        const isEmailInUse = await Users.findOne({ email, _id: { $ne: userId } });
        if (isEmailInUse) {
            return res.status(400).json({ error: 'Email already in use by another user' });
        }
        if (profilePicture) {
            const uploadResult = await cloudinary.uploader.upload(profilePicture.path);

            const updateUser = Users({
                fullName,
                email,
                profilePicture: uploadResult.secure_url
            })
        } else {
            const updateUser = Users({
                fullName,
                email,
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        if (profilePicture) {
            const uploadResult = await cloudinary.uploader.upload(profilePicture.path);
            const updateFields = {
                fullName,
                email,
                password: hashedPassword,
                profilePicture: uploadResult.secure_url
            };
            const updatedUser = await Users.findByIdAndUpdate(userId, updateFields, { new: true });
            res.status(200).json(updatedUser);
        } else {
            const updateFields = {
                fullName,
                email,
                password: hashedPassword
            }
            const updatedUser = await Users.findByIdAndUpdate(userId, updateFields, { new: true });
            res.status(200).json(updatedUser);
        }
    } catch (error) {
        console.error("updating", error);
        res.status(500).send('Internal server Error');
    }
}
module.exports = update