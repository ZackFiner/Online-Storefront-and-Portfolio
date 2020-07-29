const express = require('express');

const UserCtrl = require('../controllers/user-ctrl');

const router = express.Router();

router.post('/', UserCtrl.authUser);

module.exports = router;