const express = require('express');
const users = require('../Controller/users');


const router = express.Router();

router.get('/:userId', users);

module.exports = router