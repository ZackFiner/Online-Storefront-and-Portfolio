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
    
    await getConnection().transaction( manager => {
        const inventory_records = await manager.createQueryBuilder()
            .select()
            .from(Item, "item")
            .where("item_desc_id = :desc_id", {desc_id: _id});

        if (inventory_records.length() < 1) {
            // terminate the transaction, this item doesn't exist
        }
        item = inventory_records[0];
        if (item.qty < 1) {
            // terminate the transaction, this item is out of stock
        }


    });
}