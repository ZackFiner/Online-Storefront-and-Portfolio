const {EntitySchema} = require("typeorm");
const ItemPrice = require("../../model/ItemPrice");

module.exports = new EntitySchema({
    name: "ItemPrice",
    target: ItemPrice,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        item_id: {
            type: String,
            length: 24,

        },
        price: {
            type: "decimal",
            precision: 10,
            scale: 2,
        }
    }
})