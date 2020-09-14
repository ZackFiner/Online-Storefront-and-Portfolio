const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const RolePermissionSchema = new Schema({
    op_perm: {type: String, required: true},
    obj_perm: {type: [mongoose.Types.ObjectId], required: true},
},
{timestamps: true},
)

const UserRoleSchema = new Schema({
    name: {type: String, required: true},
    permissions: {type: [RolePermissionModel], required: true},
},
{timestamps: true},
)
const UserRoleModel = mongoose.model('user_roles', UserRoleSchema);
module.exports = UserRoleModel;