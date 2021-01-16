const role_init = require('./role_init');

const RolesInit = require('./role_init');

const init_func = async () => {
    console.log("beggining server initialization");
    await RolesInit();
};

module.exports = init_func;