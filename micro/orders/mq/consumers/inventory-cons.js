const {MQSingleton} = require('../');
const {getConnection} = require('typeorm');
const {Item, ItemPrice} = require('../../models');
const {inventory_queue} = require('../../data/server-config');

function createInvItem(content) {
    const {item_name, item_desc_id, qty, price} = content;
    const runner = getConnection().createQueryRunner();

    await runner.connect();
    await runner.startTransaction();
    try {
        const inv_result = await runner.manager
                            .insert(Item, {
                                item_name : item_name,
                                item_desc_id : item_desc_id,
                                qty : qty ? qty : 1
                            });
        
        if (inv_result.identifiers.length < 1) {
            throw new Error("Failed to create database item");
        }
        const created_id = inv_result.identifiers[0].id;
        
        const price_result = await runner.manager
                                .insert(ItemPrice, {
                                    id: created_id,
                                    price: price,
                                });
        
        if (price_result.identifiers.length < 1) {
            throw new Error("Failed to create price information for item")
        }
        
        await runner.commitTransaction();
        await runner.release();
    } catch (err) {
        await runner.rollbackTransaction(); // roll back the transaction
        await runner.release(); // and release it
        
        return {
            success: false,
            error: err
        };
    }
    return {success: true};
}

function deleteInvItem(content) {
    const id = content.id;
    const runner = getConnection().createQueryRunner();
        
    await runner.connect();
    await runner.startTransaction();

    try {
        const inv_result = await runner.manager
                            .delete(Item, id);
        
        if (!inv_result.affected) {
            await runner.rollbackTransaction();
            await runner.release();
            return {success:true};
        }

        const price_result = await runner.manager
                                .delete(ItemPrice, id);

        if (!price_result.affected) {
            throw new Error("Failed to delete price");
        }
        
        await runner.commitTransaction();
        await runner.release();
    } catch(err) {
        await runner.rollbackTransaction();
        await runner.release();
        
        return {
            success: false,
            error: err
        }
    }

    return {success: true};
}

const invConsumer = (channel) => async (msg) => {
    const obj = JSON.parse(msg.content);
    const {action, content} = obj;
    let result;
    switch(action) {
        case "CREATE":
            result = createInvItem(content)
            break;
        case "DELETE":
            result = deleteInvItem(content)
            break;
        default:
            console.log(`Inventory Queue Error: Invalid Action ${action}`);
    }
    if (result.success)
        channel.ack(msg);
}

MQSingleton.attachConsumer(invConsumer, inventory_queue);

