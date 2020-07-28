const express = require('express');

const UserCtrl = require('../controllers/user-ctrl');

const router = epxress.router();

router.post('/authenticate', UserCtrl.authUser);

module.exports = router;