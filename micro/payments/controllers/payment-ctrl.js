const {getConnection} = require('typeorm');
const Payment = require('../model/Payment');

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
    // record the payment in the database using a transaction
    // attempt to transmit the data to paypal before confirming the transaction

}

const getPayments = async (req, res) => {
    const userdata = req.authdata?.userdata;
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
    const userdata = req.authdata?.userdata;
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


module.exports = {postPayment, getPayments, getPayment};