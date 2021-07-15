const amqp = require('amqplib');
const {mq_connection_string, orders_queue} = require('../data/server-config');

var MQConn = undefined;
var PrimaryChannel = undefined;

class MQSingleton {
    static async init() {
        try {
            MQConn = await amqp.connect(mq_connection_string);
            PrimaryChannel = await MQConn.createChannel();
        } catch (err) {
            console.log(err);
        }
    }
} // NOTE: these connections should be closed when not in use


function handleOrders(msg) {
    msg_obj = JSON.parse(msg.content);
    console.log("message")
    console.log(msg_obj);

}

const startRecievePaymentNotif = async (consumeCB) => {
    if (!MQConn) {
        await MQSingleton.init();
    }
    
    await PrimaryChannel.assertQueue(orders_queue, {durable:true});
    if (!consumeCB)
        PrimaryChannel.consume(orders_queue, handleOrders);
    else
        PrimaryChannel.consume(orders_queue, consumeCB) // consume will call the consumeCB we pass it EVERY TIME a message is added to the queue
}


module.exports = {MQSingleton, startRecievePaymentNotif};