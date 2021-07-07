const UserRoleModel = require('../../models/role-model');
const {ADMIN_ROLE_ID, USER_ROLE_ID} = require('../../boot/role_init');


const ROLE_CONSTANTS = Object.freeze({
OBJ_PERM_ANY: undefined,
OP_PERM_ANY:'any',
});

async function unpackUserRoles(user_roles) {
    role_data = await UserRoleModel.find({name: { $in: user_roles }});
    return role_data;
}
// We should probably also ACL, that way we can allow users to post/edit comments
function hasPermission (role_data, op_perm, obj_perm) {
    // it's in here that we actually check permission
    for (const role in role_data) {
        const permissions = role.permissions;
        const perm_check = permissions.some((value) => {
            const {_op_perm, _obj_perm} = value;
            if (_op_perm === op_perm) {
                return _obj_perm === OBJ_PERM_ANY || _obj_perm.some((value) => {return value === obj_perm;})
            }
            return false;
        })
        if (perm_check)
            return true;
    }
    return false;
}

module.exports = {unpackUserRoles, hasPermission, ROLE_CONSTANTS};