const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserRoleModel = new Schema({
    name: {type: String, required: true},
    permissions: {type: [String], required: true},
},
{timestamps: true},
)

modeule.exports = mongoose.model('user_roles', UserRoleModel);