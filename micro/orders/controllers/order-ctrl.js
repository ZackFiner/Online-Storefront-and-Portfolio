const {getConnection} = require("typeorm");
const {Item, ItemPrice, Order, Address} = require('../models');
const {payments} = require('../req');

postOrder = async (req, res) => {
    const body = req.body;
    //const userdata = req.userdata; // from jwt token
    const userdata = {_id: req.params.user_id};
    if (!body || !userdata) {
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
    let order_id = undefined;

    const runner = getConnection().createQueryRunner();
    let address_id = undefined;
    
    await runner.connect();
    await runner.startTransaction();

    try {
        if (address.id) {
            const r_address = await runner.manager.createQueryBuilder()
                                .select("address")
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
            const result = await runner.manager.insert(Address, {
                user_id : userdata._id,
                street_address : address.street_address,
                city : address.city,
                state_code : address.state_code,
                zip : address.zip,
            });
            address_id = result.identifiers[0].id;
        }

        const inventory_record = await runner.manager
                .createQueryBuilder()
                .select("item")
                .from(Item, "item")
                .leftJoinAndMapOne("item.price", ItemPrice, "price", "price.id = item.id")
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

        await runner.manager.update(Item, inventory_record.id, { // update inventory records to reflect that this item has been sold
            qty: inventory_record.qty - 1
        });

        
        const result = await runner.manager.insert(Order, {
            user_id : userdata._id,
            item_id : inventory_record.id,
            address_id : address_id,
            status : "PENDING",
        });

        order_id = result.identifiers[0].id;
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
    payments.postPayment({...payment, item_price: inventory_record.price}, {userdata:userdata})
    .then((value) => {
        const {id, paypal_payment_id} = value.data.data;
        await runner.manager.update(Order, order_id, {
            payment_id: id
        });
        await runner.commitTransaction(); // commit the transaction
        await runner.release(); // release the query runner

        return res.status(201).json({
            success: true,
            data: {
                id: order_id,
                paypal_payment_id: paypal_payment_id
            }
        });

    })
    .catch(error => {
        await runner.rollbackTransaction();
        await runner.release();
        console.log(error);
        return res.status(500).json({
            success: false,
            error: "An error occured while processing request"
        })
    })
}

getOrders = async (req, res) => {
    const {user_id} = req.params;
    const userdata = req.authdata?.userdata;

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
    const userdata = req.authdata?.userdata;
    
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