const {Item, ItemPrice} = require('../models');
const {getConnection} = require('typeorm');
// everything in here should be inter-service events

createInvItem = (req, res) => {
    const body = req.body;
    if (!body) {
        return res.status(400).json({
            success: false,
            error: "Invalid request format"
        })
    }

    try {
        const {item_name, item_desc_id, qty, price} = body;
        const runner = getConnection().createQueryRunner();

        await runner.connect();
        await runner.startTransaction();

        const inv_result = await runner.manager
                            .insert(Item, {
                                item_name : item_name,
                                item_desc_id : item_desc_id,
                                qty : qty ? qty : 1
                            });
        
        if (inv_result.identifiers.length() < 1) {
            await runner.rollbackTransaction();
            await runner.release();
            throw new Error("Failed to create database item");
        }
        const created_id = result.identifiers[0].id;
        
        const price_result = await runner.manager
                                .insert(ItemPrice, {
                                    id: created_id,
                                    price: price,
                                });
        
        if (price_result.identifiers.length() < 1) {
            await runner.rollbackTransaction();
            await runner.release();
            throw new Error("Failed to create price information for item")
        }
        
        await runner.commitTransaction();
        await runner.release();
        return res.status(201).json({
            success: false,
            data: {id: created_id}
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            error: "An error occured while processing request"
        });
    }
}

deleteInvItem = (req, res) => {
    const id = req.params.id;

    try {
        const runner = getConnection().createQueryRunner();
        
        await runner.connect();
        await runner.startTransaction();

        const inv_result = await runner.manager
                            .delete(Item, id);
        
        if (!inv_result.affected) {
            await runner.rollbackTransaction();
            await runner.release();
            return res.status(404).json({
                success: false,
                error: "No item with that ID exists"
            });
        }
        const price_result = await runner.manager
                                .delete(ItemPrice, id);

        if (!price_result.affected) {
            await runner.rollbackTransaction();
            await runner.release();
            throw new Error("Failed to delete price");
        }
        await runner.commitTransaction();
        await runner.release();

        return res.status(200).json({
            success: true
        });

    } catch(err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            error: "An error occured while processing request"
        })
    }
}

module.exports = {createInvItem, deleteInvItem};