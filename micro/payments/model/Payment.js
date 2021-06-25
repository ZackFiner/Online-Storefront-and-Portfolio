module.exports = class Payment {
    constructor(id, user_id, amount, timestamp, status) {
        this.id = id;
        this.user_id = user_id;
        this.amount = amount;
        this.timestamp = timestamp;
        this.status = status;
    }
}