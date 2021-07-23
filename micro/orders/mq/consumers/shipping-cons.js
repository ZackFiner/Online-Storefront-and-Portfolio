const {MQSingleton} = require('../');
const {getConnection} = require('typeorm');
const {Order, Address} = require('../../models');
const {shipping_queue} = require('../../data/server-config');


const createShippingAddress = async (content) => {
    const {paypal_order_id, user_id, address: {street_address, city, state_code, zip}} = content;

    const runner = getConnection().createQueryRunner();
    await runner.connect();
    await runner.startTransaction();
    try {
        const adr_result = await runner.manager.insert(Address, {
            user_id: user_id,
            street_address: street_address,
            city: city,
            state_code: state_code,
            zip: zip
        });

        if (adr_result.identifiers.length < 1) {
            throw new Error("Failed to insert address");
        }

        const odr_result = await runner.manager.update(Order, {paypal_order_id: paypal_order_id}, {
            address_id: adr_result.identifiers[0].id
        })
        
        if (!odr_result.affected) {
            throw new Error("Failed to add address to order");
        }

        await runner.commitTransaction();
        await runner.release();
    } catch (err) {
        await runner.rollbackTransaction();
        await runner.release();
        return {success: false, error: err}
    }
    return {success: true};
}

const updateShippingAddress = async (content) => {
    const {address_id, address} = content;

    const runner = getConnection().createQueryRunner();
    await runner.connect();
    await runner.startTransaction();

    try {
        const update_result = await runner.manager.update(Address, address_id, {
            ...address
        });
        
        await runner.commitTransaction();
        await runner.release();
    } catch (err) {
        await runner.rollbackTransaction();
        await runner.release();
        return {success: false, error: err}
    }
    return {success: true};
}

const shippingConsumer = (channel) => async (msg) => {
    const obj = JSON.parse(msg.content);
    const {action, content} = obj;

    let result;
    switch(action) {
        case "CREATE":
            result = await createShippingAddress(content);
            break;
        case "UPDATE":
            result = await updateShippingAddress(content);
            break;
        default:
            result = {success: false, error: `Shipping Queue Error: Invalid action ${action}`};
    }

    if (result.success)
        channel.ack(msg);
    else
        console.log(result.error);
}

MQSingleton.attachConsumer(shippingConsumer, shipping_queue);