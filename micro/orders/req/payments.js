
const {payment_endpoint, api_cred} = require('../data/server-config.js')
const axios = require("axios");

const payment_api = axios.create({
    baseURL: payment_endpoint,
});

const postPayment = (payment) => {
    return payment_api.post(payment, {
        headers: {
            Authorization: `Basic ${api_cred}`
        }
    });
}

module.exports = {postPayment}