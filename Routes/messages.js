const express = require('express');
const messagesGet = require('../Controller/messageGet');

const router = express.Router();

router.get('/:conversationId', messagesGet);

module.exports = router