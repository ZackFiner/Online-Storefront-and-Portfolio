const RoleAccessor = require('./RoleAccessor');
const RoleCheckMiddleware = require('./middleware/RoleCheckMiddleware');
const {unpackUserRoles, hasPermission, ROLE_CONSTANTS} = require('./RoleUtilities');

module.exports = {RoleAccessor, RoleCheckMiddleware, unpackUserRoles, hasPermission, ROLE_CONSTANTS};