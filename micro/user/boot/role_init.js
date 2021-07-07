const UserRoleModel = require('../models/role-model');

const role_init = async () => {
    await UserRoleModel.find({name: 'ROLE_ADMIN'}, (err, res) => {
        if (!err) {
            if (res.length > 0) {
                console.log("NOTIFICATION: admin role exists");
            } else {
                console.log("NOTIFICATION: admin role doesn't exist");
                console.log("NOTIFICATION: creating default admin role");
                const default_admin_role = new UserRoleModel({
                    name: 'ROLE_ADMIN',
                    permissions: [{
                        op_perm: 'any',
                    }],
                });
                default_admin_role.save().then((doc) => {
                });
                
            }
        } else {
            console.log('NOTIFICATION: An error occurred during base role retrieval');
            console.log(err);
        }
    });

    await UserRoleModel.find({name: 'ROLE_USER'}, (err, res) => {
        if (!err) {
            if (res.length > 0) {
                console.log("NOTIFICATION: user role exists");
                global.USER_ROLE_ID = res[0]._id;
            } else {
                console.log("NOTIFICATION: user role doesn't exist");
                console.log("NOTIFICATION: creating default user role");
                const default_user_role = new UserRoleModel({
                    name: 'ROLE_USER', // users have the power to view items and reviews, and create/view reviews
                    permissions: [{
                        op_perm: 'ITEM_READ',
                    },
                    {
                        op_perm: 'REVIEW_READ',
                    },
                ],
                });

                default_user_role.save().then((doc) => {
                })

            }
        } else {
            console.log('NOTIFICATION: An error occurred during base role retrieval');
            console.log(err);
        }
    });
}

module.exports = {RolesInit: role_init};