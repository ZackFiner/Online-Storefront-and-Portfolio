const UserRoleModel = require('../models/role-model');

const ROLE_CONSTANTS = Object.freeze({
OBJ_PERM_ANY:'any',
OP_PERM_ANY:'any',
});

async function unpackUserRoles(user_roles) {
    role_data = await UserRoleModel.find({_id: { $in: user_roles }});
    return role_data;
}

function hasPermission (role_data, op_perm, obj_perm) {
    // it's in here that we actually check permission
    for (const role in role_data) {
        const permissions = role.permissions;
        const perm_check = permissions.some((value) => {
            const {_op_perm, _obj_perm} = value; 
            return (_op_perm===op_perm) && 
                   (_obj_perm===obj_perm || _obj_perm===OBJ_PERM_ANY);
        })
        if (perm_check)
            return true;
    }
    return false;
}

module.exports = {unpackUserRoles, hasPermission, ROLE_CONSTANTS};