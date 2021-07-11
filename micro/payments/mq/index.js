const amqp = require('amqplib');
const {mq_connection_string, orders_queue} = require('../data/server-config');

const MQConn = await amqp.connect(mq_connection_string);
const PrimaryChannel = await MQConn.createChannel();

const sendMessageToOrders = async (json_msg) => {
    if (!MQConn) {
        throw new Error("Error: cannot publish without a MQ connection");
    }

    await PrimaryChannel.assertQueue(orders_queue, {durable:true});
    PrimaryChannel.sendToQueue(orders_queue, JSON.stringify(json_msg), {persistent: true});
} 


module.exports = {MQConn, PrimaryChannel, sendMessageToOrders};