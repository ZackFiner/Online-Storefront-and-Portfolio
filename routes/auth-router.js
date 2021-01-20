const express = require('express');

const UserCtrl = require('../controllers/user-ctrl');
const withAuth = require('../middleware/authentication');
const router = express.Router();

router.post('/', UserCtrl.authUser);
router.delete('/', UserCtrl.userLogOut);
router.put('/', withAuth, UserCtrl.refreshUserToken); // user must be logged in to access this
module.exports = router;