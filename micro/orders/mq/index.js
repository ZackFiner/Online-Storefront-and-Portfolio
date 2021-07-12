const amqp = require('amqplib');
const {mq_connection_string, orders_queue} = require('../data/server-config');

var MQConn = undefined;
var PrimaryChannel = undefined;

class MQSingleton {
    static async init() {
        MQConn = await amqp.connect(mq_connection_string);
        PrimaryChannel = await MQConn.createChannel();
    }
} // NOTE: these connections should be closed when not in use

const recievePaymentNotif = async (consumeCB) => {
    if (!MQConn) {
        await MQSingleton.init();
    }

    await PrimaryChannel.assertQueue(orders_queue, {durable:true});
    PrimaryChannel.consume(orders_queue, consumeCB);
}


module.exports = {MQSingleton, recievePaymentNotif};