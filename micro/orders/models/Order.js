const {EntitySchema} = require("typeorm");

class Order {
    constructor(id, payment_id, user_id, address_id, status, timestamp, items) {
        this.id = id;
        this.payment_id = payment_id;
        this.user_id = user_id;
        this.address_id = address_id;
        this.status = status;
        this.timestamp = timestamp;
        this.items = items;
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
    },
    relations: {
        items: {
            name: "items",
            type: 'many-to-many',
            target: 'Item',
            joinTable: {
                name: "order_items",
                joinColumn: "ordersId",
                inverseJoinColumn: {
                    name: "itemsId"
                }
            },
            cascade: true,
            inverseSide: "Order"
        }
    }
})