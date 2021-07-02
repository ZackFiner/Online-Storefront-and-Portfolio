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

    

}

const getPayments = async (req, res) => {

}

const getPayment = async (req, res) => {

}


module.exports = {postPayment, getPayments, getPayment};