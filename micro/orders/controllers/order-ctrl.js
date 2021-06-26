const {getConnection} = require("typeorm");
const {Item, ItemPrice, Order, Address} = require('../models');
const {payments} = require('../req');

postOrder = async (req, res) => {
    const body = req.body;
    const userdata = req.userdata; // from jwt token

    if (!body || userdata) {
        return res.status(400).json({
            success: false,
            error: "Invalid request format"
        })
    }

    const {address, payment, item} = body;
    
    if (!payment || !item)
        return res.status(400).json({
            success: false,
            error: "Body was missing crucial information"
        });

    const {_id} = item;

    const runner = getConnection().createQueryRunner();
    await runner.connect();
    // attempt semi-critical (correctable) aspects of the order
    
    // address record creation
    let address_id = undefined;
    if (address.id) {
        const r_address = await runner.manager.createQueryBuilder()
                            .select()
                            .from(Address, "address")
                            .where("address.id = :adr_id", {adr_id: address.id})
                            .getOne();
        
        if (address) {
            address_id = r_address.id;
        } else {
            return res.status(400).json({
                success: false,
                error: "Invalid address information provided"
            })
        }
    } else {
        try {
            const result = await runner.manager.insert(Address, {
                user_id : userdata._id,
                street_address : address.street_address,
                city : address.city,
                state_code : address.state_code,
                zip : address.zip,
            });
            address_id = result.identifiers[0].id;
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                error: "An error occurred while processing request"
            })
        }
    }


    // begin critical phase of the order (non-correctable)
    await runner.startTransaction();
    const inventory_record = await runner.manager
            .createQueryBuilder(Item, "item")
            .leftJoinAndSelect(ItemPrice, "item.price", "price.id = item.id")
            .where("item.item_desc_id = :desc_id", {desc_id: _id})
            .select()
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
    const payment_res = await payments.postPayment({...payment, amount: inventory_record.price});
    
    if (payment.status >= 300 || 
        !payment_res.data.data.payment_succeeded || 
        !payment_res.data.data.payment_info.id) { // if the payment failed
        await runner.rollbackTransaction();
        await runner.release();
        return res.status(500).json({
            success: false,
            error: "An error occured while processing payment"
        });
    }
    const {payment_info} = payment_res.data.data;
    try {
        const result = await runner.manager.insert(Order, {
            payment_id : payment_info.id,
            user_id : userdata._id,
            item_id : inventory_record.id,
            address_id : address_id,
            status : "INPROCESS",
        });

        return res.status(201).json({
            success: true,
            data: {
                id: result.identifiers[0].id
            }
        })
    } catch(err) {
        console.log("CRITICAL ERROR: ORDER FAILED TO BE PLACED!");
        return res.status(500).json({
            success: false,
            error: "An error occured while processing request"
        })
    }
}

getOrders = (req, res) => {
    const {user_id} = req.params;

    if (!user_id) {
        return res.status(400).json({
            success: true,
            error: "No User ID provided",
        })
    }
    try {
        const builder = getConnection().createQueryBuilder();
        
        const orders = await builder
            .select()
            .from(Order, "order")
            .leftJoinAndSelect(Item, "item", "item.id = order.item_id")
            .leftJoinAndSelect(Address, "address", "address.id = order.address_id")
            .where("order.user_id = :user_id", {user_id: user_id})
            .getMany();
        
        res.status(200).json({
            success:true,
            data: orders
        });
    } catch(err) {
        console.log(err);
        res.status(500).json({
            success: false,
            error: "An error occured while processing request"
        });
    }
}

getOrder = (req, res) => {
    const {user_id, order_id} = req.params;

    if (!user_id || !order_id) {
        return res.status(400).json({
            success: false,
            error: "No UserID or OrderID provided"
        })
    }

    try {
        const builder = getConnection().createQueryBuilder();

        const order = await builder
                        .select()
                        .from(Order, "order")
                        .leftJoinAndSelect(Item, "item", "item.id = order.item_id")
                        .leftJoinAndSelect(Address, "address", "address.id = order.address_id")
                        .where("order.id = :order_id AND order.user_id = :user_id", {order_id: order_id, user_id: user_id})
                        .getOne();
        
        if (!order) {
            return res.status(404).json({
                success: false,
                error: "No such order exists"
            });
        }
        return res.status(200).json({
            success: true,
            data: order
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            error: "An error occured while processing request"
        })
    }
}

module.exports = {createOrder, getOrders, getOrder};