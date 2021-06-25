const {EntitySchema} = require("typeorm");

class ItemPrice {
    constructor(id, price) {
        this.id = id,
        this.price = price
    }
}

module.exports = new EntitySchema({
    name: "ItemPrice",
    tableName: "item_prices",
    target: ItemPrice,
    columns: {
        id: {
            primary: true,
            type: "int",
        },
        price: {
            type: "decimal",
            precision: 10,
            scale: 2,
            nullable: false,
        }
    }
})