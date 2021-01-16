const express = require('express');
const {RoleCheckMiddleware} = require('../authorization')
const ItemCtrl = require('../controllers/item-ctrl');
const { imageParser } = require('../db');
const router = express.Router();

const itemImageCollector = imageParser.fields([
    {name: 'selectedThumbnail', maxCount: 1},
    {name: 'galleryImages', maxCount: 16}
]);

router.post('/item', itemImageCollector, ItemCtrl.createItem);
router.put('/item/:id', itemImageCollector, ItemCtrl.updateItem);
router.delete('/item/:id', ItemCtrl.deleteItem);
router.get('/item/:id', ItemCtrl.getItemById);
router.get('/items', ItemCtrl.getItems);

module.exports = router;