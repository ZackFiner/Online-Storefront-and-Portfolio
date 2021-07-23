const {EntitySchema} = require("typeorm");


class Payment {
    constructor(id, user_id, paypal_payer_id, paypal_payment_id, paypal_order_id, paypal_authorization_id, amount, timestamp, status) {
        this.id = id;
        this.user_id = user_id;
        this.paypal_payer_id = paypal_payer_id;
        this.paypal_payment_id = paypal_payment_id;
        this.paypal_order_id = paypal_order_id;
        this.paypal_authorization_id = paypal_authorization_id;
        this.amount = amount;
        this.timestamp = timestamp;
        this.status = status;
    }
}

module.exports = new EntitySchema({
    name: "Payment",
    target: Payment,
    tableName: "payments",
    columns:{
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
        paypal_payer_id: {
            type: String,
            length: 24,
            nullable: true,
        },
        paypal_payment_id: {
            type: String,
            length: 24,
            unique: true,
            nullable: true,
        },
        paypal_order_id: {
            type: String,
            length: 24,
            unique: true,
            nullable: true,
        },
        paypal_authorization_id: {
            type: String,
            length: 24,
            unique: true,
            nullable:true,
        },
        amount: {
            type: "decimal",
            precision: 10,
            scale: 2,
            nullable: false,
        },
        timestamp: {
            type: "datetime",
            default: () => "CURRENT_TIMESTAMP",
            nullable: false,
        },
        status: {
            type: "enum",
            enum: [
                "PROCESSING",
                "APPROVED",
                "CAPTURED"
            ]
        }
    }
});