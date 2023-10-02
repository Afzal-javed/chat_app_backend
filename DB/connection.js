const mongoose = require('mongoose');
require('dotenv').config();
const url = 'mongodb+srv://afzal:2023@cluster0.uaer0fv.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("connected to Database")).catch((e) => console.log('Error', e));