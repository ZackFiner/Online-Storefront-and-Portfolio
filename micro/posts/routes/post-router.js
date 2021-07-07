const {RoleCheckMiddleware} = require('../middleware/authorization')
const express = require('express');
const postCtrl = require('../controllers/post-ctrl');
const { imageParser } = require('../db');
const router = express.Router();
const AdminRoleAuth = RoleCheckMiddleware('ROLE_ADMIN');

const mediaUpload = imageParser.fields([
    {name: 'selectedImage', maxCount: 1},
]);

router.post('/', AdminRoleAuth, postCtrl.createPost);
router.post('/media', AdminRoleAuth, mediaUpload, postCtrl.uploadImage);
router.delete('/:id', AdminRoleAuth, postCtrl.deletePost);
router.put('/:id', AdminRoleAuth, postCtrl.editPost);
router.get('/:id', postCtrl.getPost);
router.get('/', postCtrl.getPosts);

module.exports = router;