const {EntitySchema} = require("typeorm");

class Item {
    constructor(id, item_name, item_desc_id, qty) {
        this.id = id;
        this.item_name = item_name;
        this.item_desc_id = item_desc_id;
        this.qty = qty;
    }
}

module.exports = new EntitySchema({
    name: "Item",
    target: Item,
    tableName: "items",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        item_name: {
            type: String,
            length: 24,
        },
        item_desc_id: {
            type: String,
            length: 24,
            unique: true,
            nullable: false,
        },
        qty: {
            type: "int"
        }
    }
})