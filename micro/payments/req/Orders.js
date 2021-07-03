const axios = require('axios');
const {order_api} = require('../data/server-config');
const {generateAPIToken} = require('../utils');
const order_api_ax = axios.create({
    baseURL: order_api
});

const notifyOrdersPayment = (payment_id, status) => {
    return order_api_ax.post('/notifications/payments/', {
        payment_id: payment_id,
        status: status
    },
    {
        headers: {
            Authorization: `Bearer ${generateAPIToken({})}`
        }
    })
}

module.exports = {notifyOrdersPayment}