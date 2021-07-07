const {EntitySchema} = require("typeorm");

class Order {
    constructor(id, payment_id, user_id, item_id, address_id, status, timestamp) {
        this.id = id;
        this.payment_id = payment_id;
        this.user_id = user_id;
        this.item_id = item_id;
        this.address_id = address_id;
        this.status = status;
        this.timestamp = timestamp;
    }
}

module.exports = new EntitySchema({
    name: "Order",
    tableName: "orders",
    target: Order,
    columns: {
        id: {
            primary: true,
            generated: true,
            type: "int",
        },
        payment_id: {
            type: "int",
            nullable: true,
        },
        user_id: {
            type: String,
            length: 24,
            nullable: false
        },
        item_id: {
            type: "int",
            nullable: false,
        },
        address_id: {
            type: "int",
            nullable: false,
        },
        status: {
            type: "enum",
            enum: [
                "PENDING",
                "PROCESSING",
                "SHIPPED",
                "DELIVERED",
            ]
        },
        timestamp: {
            type: "datetime",
            default: () => "CURRENT_TIMESTAMP",
            nullable: false,
        }
    }
})