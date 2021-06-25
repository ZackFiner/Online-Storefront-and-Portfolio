const typeorm = require("typeorm");
const {mysql_connection_creds} = require("../data/server-config");

const dbcon = mysql.createConnection({
    name: "default",
    ...mysql_connection_creds, 
    entities: [
        ...require("../models")
    ],
});

module.exports = {dbcon}