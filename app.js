const express = require('express');
const Users = require('./models/users');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv');
const register = require('./Controller/registerController.js');
const login = require('./Controller/auth');
const update = require('./Controller/update');
const logoutRouter = require('./Routes/logout.js');
const deleteRouter = require('./Routes/delete.js');
const userRouter = require('./Routes/users');
const conversationPostRouter = require('./Routes/conversation');
const conversationGetRouter = require('./Routes/conversation');
const messagesGet = require('./Routes/messages');
const messagesPost = require('./Controller/messages');
const moment = require('moment-timezone');
require('./DB/connection');
const cloudinary = require('cloudinary').v2;

//socket code
const io = require('socket.io')(8002, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
    }
});

let users = [];

io.on('connection', socket => {
    console.log("user connected");
    socket.on('addUser', userId => {
        const isUserExist = users.find(user => user.userId === userId);
        if (!isUserExist) {
            const user = { userId, socketId: socket.id };
            users.push(user);
            io.emit('getUsers', users);
        }
    });

    socket.on('sendMessage', async ({ senderId, receiverId, message, conversationId }) => {
        const receiver = users.find(user => user.userId === receiverId);
        const sender = users.find(user => user.userId === senderId);
        const user = await Users.findById(senderId);
        const timestamp = moment().format('LT')
        if (receiver) {
            io.to(receiver.socketId).to(sender.socketId).emit('getMessage', {
                senderId,
                message,
                conversationId,
                receiverId,
                time: timestamp,
                user: { id: user._id, fullName: user.fullName, email: user.email }
            });

        } else {
            io.to(sender.socketId).emit('getMessage', {
                senderId,
                message,
                conversationId,
                receiverId,
                time: timestamp,
                user: { id: user._id, fullName: user.fullName, email: user.email }
            });

        }

    });

    socket.on('disconnect', () => {
        const disconnectedUser = users.find(user => user.socketId === socket.id);
        if (disconnectedUser) {
            users = users.filter(user => user.socketId !== socket.id);
            io.emit('getUsers', users);
        }
    });
});

//config
dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET_KEY
});
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use("/assets", express.static("/assets"));

//mullter
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Define the destination folder where uploaded files will be stored
        cb(null, 'uploads/profile-pictures');
    },
    filename: (req, file, cb) => {
        // Generate a unique file name for each uploaded file
        const extname = path.extname(file.originalname);
        cb(null, `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${extname}`);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error('Only image files are allowed'), false); // Reject the file
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB (adjust as needed)
});

//api
app.get('/', (req, res) => {
    res.send('hello world!');
})
app.post('/api/register', upload.single('profilePicture'), register);
app.post('/api/login', upload.single('profilePicture'), login)
app.patch('/api/update/:userId', upload.single('profilePicture'), update);
app.post('/api/message', upload.single('photo'), messagesPost);
app.use('/api/users', userRouter);
app.use('/api/logout', logoutRouter);
app.use('/api/delete', deleteRouter);
app.use('/api', conversationPostRouter)
app.use('/api/conversations', conversationGetRouter);
app.use('/api/message', messagesGet);

app.listen(process.env.PORT || 8080, () => {
    console.log(`serevr run on ${process.env.PORT}`);
})