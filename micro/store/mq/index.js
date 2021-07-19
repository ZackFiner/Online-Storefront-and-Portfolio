const amqp = require('amqplib');
const {mq_connection_string} = require('../data/server-config');

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

    static async attachConsumer(consumerCB, queue, queue_options={durable:true}) {
        if (!MQConn) {
            await MQSingleton.init();
        }

        await PrimaryChannel.assertQueue(queue, queue_options);
        PrimaryChannel.consume(queue, consumerCB(PrimaryChannel));
    }

    static async sendMessageToQueue(queue, message, queue_options={durable:true}, message_options={persistent: true}) {
        if (!MQConn) {
            await MQSingleton.init();
        }

        await PrimaryChannel.assertQueue(queue, queue_options);
        PrimaryChannel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), message_options);
    }

} // NOTE: these connections should be closed when not in use

module.exports = {MQSingleton};