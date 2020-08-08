const express = require('express');

const UserCtrl = require('../controllers/user-ctrl');

const router = express.Router();

router.post('/', UserCtrl.authUser);
router.delete('/', UserCtrl.userLogOut);
module.exports = router;