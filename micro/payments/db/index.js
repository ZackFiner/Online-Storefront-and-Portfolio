const typeorm = require("typeorm");
const {mysql_connection_creds} = require("../data/server-config");

const dbcon = mysql.createConnection({
    ...mysql_connection_creds, 
    entities: [
        require("./entities/ItemPriceEnt"),
        require("./entities/PaymentEnt")
    ],
});

module.exports = {dbcon}