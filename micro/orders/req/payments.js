
const {payment_endpoint} = require('../data/server-config.js')
const axios = require("axios");
const {generateAPIToken} = require('../utils');

const payment_api = axios.create({
    baseURL: payment_endpoint,
});

const postPayment = (payment) => {
    return payment_api.post(payment, {
        headers: {
            Authorization: `Bearer ${generateAPIToken()}`
        }
    });
}

module.exports = {postPayment}