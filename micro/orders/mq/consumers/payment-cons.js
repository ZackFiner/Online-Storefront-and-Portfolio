const {MQSingleton} = require('../');
const {getConnection} = require('typeorm');
const {Order} = require('../../models');


const consumePayment = (channel) => async (msg) => {
    const body = JSON.parse(msg.content);
    const runner = getConnection().createQueryRunner();

    await runner.connect();
    await runner.startTransaction();
    try {
        const {payment_id, status, timestamp} = body;
        if (status != "APPROVED") {
            throw new Error("Ann issue occured while processing payment");
        }

        const result = await runner.manager.update(Order, {
            payment_id: payment_id,
            status: "PENDING"
        },
        {
            status: "PROCESSING"
        });

        if (!result.affected) {
            throw new Error("Payment doesn't belong to any recored order");
        }

        await runner.commitTransaction();
        channel.ack(msg);
        await runner.release();
    } catch(err) {
        console.log(err);
        await runner.rollbackTransaction();
        await runner.release();
    }
}

MQSingleton.attachConsumer(consumePayment, 'orders_queue');