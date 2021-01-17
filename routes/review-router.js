const express = require('express');
const RoleCheckMiddleware = require('../authorization/middleware/RoleCheckMiddleware');
const ReviewCtrl = require('../controllers/review-ctrl');

const router = express.Router();
const AdminRoleAuth = RoleCheckMiddleware('admin');
const UserRoleAuth = RoleCheckMiddleware('user');

router.get('/review/:id', ReviewCtrl.getReviewById);
router.post('/review', UserRoleAuth, ReviewCtrl.createReview); // only loggedin users should be allowed to post reviews
router.delete('/review/:id', AdminRoleAuth, ReviewCtrl.deleteReview); // only admins can delete reviews

module.exports = router;