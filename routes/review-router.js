const express = require('express');

const ReviewCtrl = require('../controllers/review-ctrl');

const router = express.Router();

router.get('/review/:id', ReviewCtrl.getReviewById);
router.post('/review', ReviewCtrl.createReview);
router.delete('/review/:id', ReviewCtrl.deleteReview);

module.exports = router;