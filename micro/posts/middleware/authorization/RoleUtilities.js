
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

module.exports = {hasPermission};