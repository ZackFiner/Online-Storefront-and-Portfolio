const amqp = require('amqplib');
const {mq_connection_string, orders_queue} = require('../data/server-config');

var MQConn = undefined;
var PrimaryChannel = undefined;

class MQSingleton {
    static async init() {
        try {
            MQConn = await amqp.connect(mq_connection_string);
            PrimaryChannel = await MQConn.createChannel();
        } catch(err) {
            console.log(err);
        }
    }
}


const sendMessageToOrders = async (json_msg) => {
    if (!MQConn) {
        await MQSingleton.init();
    }

    await PrimaryChannel.assertQueue(orders_queue, {durable:true});
    PrimaryChannel.sendToQueue(orders_queue, Buffer.from(JSON.stringify(json_msg)), {persistent: true});
} 


module.exports = {MQSingleton, sendMessageToOrders};