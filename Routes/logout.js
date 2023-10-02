const express = require('express');
const logout = require('../Controller/logout');

const router = express.Router();

router.post('/:userId', logout);

module.exports = router