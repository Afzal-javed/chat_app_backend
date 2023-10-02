const express = require('express');
const deleteUser = require('../Controller/delete');
const router = express.Router();

router.delete('/:userId', deleteUser)
module.exports = router;