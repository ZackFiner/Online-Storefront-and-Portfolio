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
    
    await getConnection().transaction( async manager => {
        const inventory_record = await manager
            .createQueryBuilder(Item, "item")
            .leftJoin(ItemPrice, "price", "price.id = item.id")
            .where("item.item_desc_id = :desc_id", {desc_id: _id})
            .getOne();

        if (!inventory_record) {
            // terminate the transaction, this item doesn't exist
            return;
            
        }
        if (inventory_record.qty < 1) {
            // terminate the transaction, this item is out of stock
            return;
        }

        // send event to payments API with the price of the item and the payment info
        
        // if the payment was approved, complete the order (create the order entity)
        
        // otherwise exit and notify the order failed

    });
}