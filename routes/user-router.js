const express = require('express');

const UserCtrl = require('../controllers/user-ctrl');

const router = express.router();

router.post('/', UserCtrl.createUser);

module.exports = router;