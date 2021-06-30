const RoleCheckMiddleware = require('./RoleCheckMiddleware');
const {hasPermission} = require('./RoleUtilities');

module.exports = {RoleCheckMiddleware, hasPermission};