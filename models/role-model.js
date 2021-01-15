const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const PermissionSchema = new Schema({
    op_perm: {type: String, required: true},
    obj_perm: {type: [mongoose.Types.ObjectId], required: true},
},
{timestamps: true},
)

const UserRoleSchema = new Schema({
    name: {type: String, required: true},
    permissions: {type: [PermissionSchema], required: true},
},
{timestamps: true},
)

const ItemAccessList = new Schema({
    collection_type: {type: String, required: true},
    obj_id: {type: mongoose.Types.ObjectId, required: true},
    user_id: {type: mongoose.Types.ObjectId, required: true},
    permissions: {type: [PermissionSchema], required: true}
})

const UserRoleModel = mongoose.model('user_roles', UserRoleSchema);
module.exports = UserRoleModel;