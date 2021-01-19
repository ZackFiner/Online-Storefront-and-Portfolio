function isMemberofRole(userdata, role) {
    if (userdata && userdata.roles) { 
        return userdata.roles.includes(role);
    }
    return false;
}

function hasRole(userdata, roles) {
    if (userdata && userdata.roles) {
        return userdata.roles.some(r => roles.includes(r));
    }
    return false;
}

export {isMemberofRole, hasRole};