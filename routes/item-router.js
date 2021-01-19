const express = require('express');
const {RoleCheckMiddleware} = require('../authorization')
const ItemCtrl = require('../controllers/item-ctrl');
const { imageParser } = require('../db');
const router = express.Router();

const itemImageCollector = imageParser.fields([
    {name: 'selectedThumbnail', maxCount: 1},
    {name: 'galleryImages', maxCount: 16}
]);

const AdminRoleAuth = RoleCheckMiddleware('admin');

router.post('/item', AdminRoleAuth, itemImageCollector, ItemCtrl.createItem);
router.put('/item/:id', AdminRoleAuth, itemImageCollector, ItemCtrl.updateItem);
router.delete('/item/:id', AdminRoleAuth, ItemCtrl.deleteItem);
router.get('/item/:id', ItemCtrl.getItemById);
router.get('/items', ItemCtrl.getItems);

module.exports = router;