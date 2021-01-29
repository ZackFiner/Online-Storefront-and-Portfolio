const {RoleCheckMiddleware} = require('../authorization')
const express = require('express');
const postCtrl = require('../controllers/post-ctrl');

const router = express.Router();
const AdminRoleAuth = RoleCheckMiddleware('admin');

router.post('/', AdminRoleAuth, postCtrl.createPost);
router.delete('/:id', AdminRoleAuth, postCtrl.deletePost);
router.put('/:id', AdminRoleAuth, postCtrl.editPost);
router.get('/:id', postCtrl.getPost);
router.get('/', postCtrl.getPosts);

module.exports = router;