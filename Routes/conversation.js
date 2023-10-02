const express = require('express');
const conversationGet = require('../Controller/conversation');
const conversationPost = require('../Controller/conversation');
const router = express.Router();

router.post('/conversation', conversationPost);
router.get('/:userId', conversationGet)

module.exports = router