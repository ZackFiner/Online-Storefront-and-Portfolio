
const {payment_endpoint, api_cred} = require('../data/config.js')
const axios = require("axios");

const postPayment = (payment) => {
    return axios.post(payment_endpoint, payment, {
        headers: {
            Authorization: `Basic ${api_cred}`
        }});
}

module.exports = {postPayment}