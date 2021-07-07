const express = require('express');
const {RoleCheckMiddleware} = require('../middleware/authorization')
const ItemCtrl = require('../controllers/item-ctrl');
const ReviewCtrl = require('../controllers/review-ctrl');
const { imageParser } = require('../db');
const router = express.Router();

const itemImageCollector = imageParser.fields([
    {name: 'selectedThumbnail', maxCount: 1},
    {name: 'galleryImages', maxCount: 16}
]);

const AdminRoleAuth = RoleCheckMiddleware('ROLE_ADMIN');

router.post('/', AdminRoleAuth, itemImageCollector, ItemCtrl.createItem);
router.put('/:id', AdminRoleAuth, itemImageCollector, ItemCtrl.updateItem);
router.delete('/:id', AdminRoleAuth, ItemCtrl.deleteItem);
router.get('/:id', ItemCtrl.getItemById);
router.get('/', ItemCtrl.getItems);
router.post('/search', ItemCtrl.searchItems);

router.post('/:id/reviews', AdminRoleAuth, ReviewCtrl.createReview);
router.delete('/:id/reviews/:reviewId', AdminRoleAuth, ReviewCtrl.deleteReview);
router.get('/:id/reviews/:reviewId', ReviewCtrl.getReviewById);

module.exports = router;