const {getConnection} = require("typeorm");
const {Item, ItemPrice} = require('../models');

postOrder = async (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: "No body was provided"
        })
    }

    const {payment, item} = body;
    if (!payment || !item)
        return res.status(400).json({
            success: false,
            error: "Body was missing crucial information"
        });
    const {_id} = item;
    const runner = getConnection().createQueryRunner();
    await runner.connect();
    await runner.startTransaction();
    const inventory_record = await runner.manager
            .createQueryBuilder(Item, "item")
            .leftJoin(ItemPrice, "price", "price.id = item.id")
            .where("item.item_desc_id = :desc_id", {desc_id: _id})
            .getOne();

    if (!inventory_record) {
        // terminate the transaction, this item doesn't exist
        await runner.rollbackTransaction();
        await runner.release();
        return res.status(404).json({
            success: false,
            error: "No such item exists"
        });
    }

    if (inventory_record.qty < 1) {
        await runner.rollbackTransaction();
        await runner.release();
        return res.status(200).json({
            success: false,
            message: "Item is out of stock"
        });
    }

    // send event to payments API with the price of the item and the payment info
    
    // if the payment was approved, complete the order (create the order entity)
    
    // otherwise exit and notify the order failed


}