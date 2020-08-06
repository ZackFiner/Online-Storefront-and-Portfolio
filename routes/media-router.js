const express = require('express');

const mediaCtrl = require('../controllers/media-ctrl');

const router = express.Router();

router.get('/:id', mediaCtrl.getImage);
router.search('/', mediaCtrl.getImages);

module.exports = router;