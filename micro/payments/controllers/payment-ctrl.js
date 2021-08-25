const {getConnection} = require('typeorm');
const Payment = require('../model/Payment');
const {PayPal} = require('../req');
const {sendMessageToOrders} = require('../mq');


const postPayment = async (req, res) => {
    const {body, authdata} = req;
    if (!authdata) {
        res.status(401).send("Unauthorized: authdata could not be parsed");
    }

    if (!body) {
        res.status(400).json({
            success: false,
            error: "Reqeust body could not be parsed"
        });
    }

    // ensure the data sent is valid and ready for transmission to paypal
    const {item_price, order_info} = body;
    const runner = getConnection().createQueryRunner();
    await runner.connect();
    await runner.startTransaction();
    
    let payment_id = undefined;
    try {
        // record the payment in the database using a transaction
        const result = await runner.manager.insert(Payment, {
            user_id: authdata.userdata._id,
            amount: item_price,
            status: "PROCESSING",
        });
        payment_id = result.identifiers[0].id;

    } catch (err) {
        await runner.rollbackTransaction();
        await runner.release();
        console.log(err);
        return res.status(500).json({
            success: false,
            error: "An error occured while processing request"
        });
    }
    
    PayPal.PayPalSingleton.createOrder(item_price, order_info, '/', '/') // attempt to transmit the data to paypal before confirming the transaction
    .then(async (value) => {
        const result = await runner.manager.update(Payment, payment_id, {
            paypal_order_id: value.data.id
        })

        if (!result.affected)
            throw new Error("Could not capture order id")

        await runner.commitTransaction();
        await runner.release();

        return res.status(200).json({
            success: true,
            data: {
                id: payment_id,
                paypal_order_id: value.data.id
            }
        });
    })
    .catch(async error => {
        // roll back the transaction
        // notify the user that an issue has occured creating the payment
        await runner.rollbackTransaction();
        await runner.release();
        console.log(error);
        return res.status(500).json({
            success: false,
            error: "An error occured while processing request"
        });
    })
}


const executePayment = async (req, res) => {
    const {body, authdata} = req;
    
    if (!authdata) {
        res.status(401).send("Unauthorized: authdata could not be parsed");
    }

    if (!body) {
        res.status(400).json({
            success: false,
            error: "Reqeust body could not be parsed"
        });
    }

    const {order_id, payer_id} = body;
    
    const runner = getConnection().createQueryRunner();
    await runner.connect();
    await runner.startTransaction();
    
    try {
        const payment = await runner.manager.createQueryBuilder()
                                    .select('payment')
                                    .from(Payment, 'payment')
                                    .where('paypal_order_id = :_order_id', {_order_id: order_id})
                                    .getOne();
        
        if (!payment) {
            throw new Error("No Payment with the specified id was found");
        }

        const paypal_req_result = await PayPal.PayPalSingleton.captureOrder(order_id, payer_id);

        if (paypal_req_result.data.status != 'COMPLETED')
        {
            throw new Error("Failed to authorize payment")
        }
        const authorization_id = paypal_req_result.data.purchase_units[0].payments.captures[0].id;
        //console.log(paypal_req_result.data.purchase_units[0].payments);
        const update_result = await runner.manager.update(Payment, payment.id, {
            paypal_authorization_id: authorization_id,
            status: "APPROVED"
        });

        if (!update_result.affected) {
            throw new Error(`Payment ${payment.id} has been approved and is ready for capture, but could not be recorded in local db`);
        }

        // the data in the result should be saved
        await sendMessageToOrders({payment_id: payment.id, status: payment.status}); // publish the payment's status to the orders queue
        

        await runner.commitTransaction();
        await runner.release();
        return res.status(200).json({
            success:true
        })

    } catch (err) {
        console.log(err);
        console.log("----ERROR DETAILS----");
        console.log(err.response.data.details);
        await runner.rollbackTransaction();
        await runner.release();

        return res.status(500).json({
            success: false,
            error: "An error occured while processing request"
        });
    }
}

const getPayments = async (req, res) => {
    const userdata = req.authdata ? req.authdata.userdata : undefined;
    const {user_id} = req.params;

    if (!userdata || userdata._id != user_id) {
        return res.status(401).send("Unauthorized")
    }

    if (!user_id) {
        return res.status(400).json({
            success: false,
            error: "No user id was specified"
        });
    }
    try {
        const builder =  getConnection().createQueryBuilder();
        const payments = await builder
                                .select('payment')
                                .from(Payment, 'payment')
                                .where("payment.user_id = :_user_id", {_user_id: user_id})
                                .getMany();
    
        return res.status(200).json({
            success: true,
            data: payments
        });
    
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            error: "An error occured while processing request"
        });
    }
}

const getPayment = async (req, res) => {
    const userdata = req.authdata ? req.authdata.userdata : undefined;
    const {user_id, payment_id} = req.params;

    if (!userdata || userdata._id != user_id) {
        return res.status(401).send("Unauthorized")
    }

    if (!user_id || !payment_id) {
        return res.status(400).json({
            success: false,
            error: "No user id or payment id was specified"
        });
    }
    try {
        const builder = getConnection().createQueryBuilder();
        const payment = await builder
                                .select('payment')
                                .from(Payment, 'payment')
                                .where('payment.id = :_payment_id, payment.user_id = :_user_id', {_payment_id: payment_id, _user_id: user_id});

        if (!payment) {
            return res.status(404).json({
                success: false,
                error: "No payment with the specified id exists"
            });
        }

        return res.status(200).json({
            success: true,
            data: payment
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            error: "An error occured while processing request"
        });
    }
}

module.exports = {postPayment, executePayment, getPayments, getPayment};