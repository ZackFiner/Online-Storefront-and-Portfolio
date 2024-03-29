const {getConnection} = require("typeorm");
const {Item, ItemPrice, Order, Address} = require('../models');
const {payments} = require('../req');
const {retrieveOrCreateAddress, getItemRecords, getOrderCost} = require('./util');

postOrder = async (req, res) => {
    const body = req.body;
    const userdata = req.authdata ? req.authdata.userdata : undefined; // from jwt token

    if (!body || !userdata) {
        return res.status(400).json({
            success: false,
            error: "Invalid request format"
        })
    }

    const {address, payment, items} = body;
    
    if (!payment || !items)
        return res.status(400).json({
            success: false,
            error: "Body was missing crucial information"
        });

    const item_ids = items.map(item => {return item._id});

    const runner = getConnection().createQueryRunner();
    let order_id = undefined;
    let address_id = undefined;
    let cost = undefined;

    await runner.connect();
    await runner.startTransaction();
    try {
        
        const r_address = await retrieveOrCreateAddress(runner, userdata, address);
        address_id = r_address.id;

        // TODO: we should be a bit more clever, and combine these queries
        inventory_records = await getItemRecords(runner, item_ids);
        cost = await getOrderCost(runner, item_ids);


        if (!inventory_records) {
            // terminate the transaction, this item doesn't exist
            await runner.rollbackTransaction();
            await runner.release();
            return res.status(404).json({
                success: false,
                error: "No such item exists"
            });
        }

        if (inventory_records.length < item_ids.length) {
            await runner.rollbackTransaction();
            await runner.release();
            return res.status(400).json({
                success: false,
                message: "Requested Items are out of stock"
            });
        }
/*
        // The code below changes inventory record to reflect sale
        await runner.manager.update(Item, 
            inventory_records.map(item=>{
                return item.id;
            }), 
            inventory_records.map(item=>{return {
                qty: item.qty-1
            };})
        )*/

        const result = await runner.manager.getRepository(Order).save({
            user_id : userdata._id,
            address_id : address_id,
            status : "PENDING",
            items : inventory_records.map(item => {const filtered = {...item}; delete filtered.price; return filtered})
        });

        order_id = result.id;
    } catch(err) {
        await runner.rollbackTransaction();
        await runner.release();
        console.log(err);
        return res.status(500).json({
            success: false,
            error: "An error occured while processing request"
        });
    }
    // send event to payments API with the price of the item and the payment info
    // TODO: you need to sum the prices in sql using SUM, DON'T do it in JS as SQL has fixed point arithmitic working
    payments.postPayment({...payment, 
        item_price: cost, 
        order_info:{
            items: inventory_records.map(item => {return {id: item.id, name: item.item_name, quantity: 1, price: item.price.price}})
    }}, {userdata:userdata})
    .then(async (value) => {
        const {id, paypal_order_id} = value.data.data;
        await runner.manager.update(Order, order_id, {
            payment_id: id
        });
        await runner.commitTransaction();
        await runner.release();

        return res.status(201).json({
            success: true,
            data: {
                id: order_id,
                paypal_order_id: paypal_order_id
            }
        });
    })
    .catch(async (error) => {
        await runner.rollbackTransaction();
        await runner.release();
        console.log(error);
        return res.status(500).json({
            success: false,
            error: "An error occured while processing request"
        })
    })
}

// TODO: update these
getOrders = async (req, res) => {
    const {user_id} = req.params;
    const userdata = req.authdata ? req.authdata.userdata : undefined;

    if (!userdata || userdata._id != user_id) {
        return res.status(401).send("Unauthorized")
    }

    if (!user_id) {
        return res.status(400).json({
            success: true,
            error: "No User ID provided",
        })
    }

    try {
        const builder = getConnection().createQueryBuilder();
        
        const orders = await builder
            .select("order")
            .from(Order, "order")
            .leftJoinAndMapOne("order.item", Item, "item", "item.id = order.item_id")
            .leftJoinAndMapOne("order.address", Address, "address", 'address.id = order.address_id')
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

getOrder = async (req, res) => {
    const {user_id, order_id} = req.params;
    const userdata = req.authdata ? req.authdata.userdata : undefined;
    
    if (!userdata || userdata._id != user_id) {
        return res.status(401).send("Unauthorized")
    }

    if (!user_id || !order_id) {
        return res.status(400).json({
            success: false,
            error: "No UserID or OrderID provided"
        })
    }

    try {
        const builder = getConnection().createQueryBuilder();

        const order = await builder
                        .select("order")
                        .from(Order, "order")
                        .leftJoinAndMapOne("order.item", Item, "item", "item.id = order.item_id")
                        .leftJoinAndMapOne("order.address", Address, "address", 'address.id = order.address_id')
                        .where("order.id = :_order_id AND order.user_id = :user_id", {_order_id: order_id, user_id: user_id})
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

module.exports = {postOrder, getOrders, getOrder};