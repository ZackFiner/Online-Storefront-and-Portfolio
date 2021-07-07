const typeorm = require("typeorm");
const {mysql_connection_creds} = require("../data/server-config");

const dbcon = typeorm.createConnection({
    name: "default",
    ...mysql_connection_creds, 
    entities: [
        require("../models/Item"),
        require("../models/ItemPrice"),
        require("../models/Order"),
        require("../models/Address")
    ],
});

module.exports = {dbcon}