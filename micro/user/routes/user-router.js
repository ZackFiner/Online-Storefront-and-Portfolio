const express = require('express');

const UserCtrl = require('../controllers/user-ctrl');
const {withAuth} = require('../middleware/authentication');
const router = express.Router();

router.post('/', UserCtrl.createUser);
router.get('/', withAuth, UserCtrl.getUserData); // users must log in to access user data

router.post('/authenticate', UserCtrl.authUser);
router.delete('/authenticate', UserCtrl.userLogOut);
router.put('/authenticate', withAuth, UserCtrl.refreshUserToken); // user must be logged in to access this

module.exports = router;