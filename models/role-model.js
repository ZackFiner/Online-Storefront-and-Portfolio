const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const RolePermissionModel = new Schema({
    op_perm: {type: String, required: true},
    obj_perm: {type: [mongoose.Types.ObjectId], required: true},
},
{timestamps: true},
)

const UserRoleModel = new Schema({
    name: {type: String, required: true},
    permissions: {type: [RolePermissionModel], required: true},
},
{timestamps: true},
)

module.exports = mongoose.model('user_roles', UserRoleModel);