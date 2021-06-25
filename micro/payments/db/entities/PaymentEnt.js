const {EntitySchema} = require("typeorm");
const Payment = require("../../model/Payment");

module.exports = new EntitySchema({
    name: "Payment",
    target: Payment,
    id: {
        primary: true,
        type: "int",
        generated: true,
    },
    user_id: {
        type: String,
        length: 24,
        nullable: false,
    },
    amount: {
        type: "decimal",
        precision: 10,
        scale: 2,
        nullable: false,
    },
    timestamp: {
        type: "datetime",
        nullable: false,
    },
    status: {
        type: "enum",
        enum: [
            "PROCESSING",
            "APPROVED",
        ]
    }
})