
const {payment_endpoint} = require('../data/server-config.js')
const axios = require("axios");
const {generateAPIToken} = require('../utils');

const payment_api = axios.create({
    baseURL: payment_endpoint,
});

const postPayment = (payment, authdata) => {
    return payment_api.post(`/users/${authdata.userdata._id}/payments`, payment, {
        headers: {
            Authorization: `Bearer ${generateAPIToken(authdata)}`
        }
    });
}

module.exports = {postPayment}