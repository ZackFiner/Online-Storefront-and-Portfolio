const express = require('express');
const RoleCheckMiddleware = require('../authorization/middleware/RoleCheckMiddleware');
const ReviewCtrl = require('../controllers/review-ctrl');

const router = express.Router();
const AdminRoleAuth = RoleCheckMiddleware('admin');

router.get('/:id', ReviewCtrl.getReviewById);
router.post('/', AdminRoleAuth, ReviewCtrl.createReview); // only loggedin users should be allowed to post reviews
router.delete('/:id', AdminRoleAuth, ReviewCtrl.deleteReview); // only admins can delete reviews

module.exports = router;