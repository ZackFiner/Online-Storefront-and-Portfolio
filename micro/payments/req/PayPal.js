const axios = require('axios');
const {paypal_api, paypal_clientid, paypal_secret} = require('../data/server-config');

const paypal_api = axios.create({
    baseURL: paypal_api
});

const getAccessToken = () => {
    return paypal_api.post('/v1/oauth2/token', {}, {
        headers: {
            Authorization: `Basic ${paypal_clientid}:${paypal_secret}`
        }
    });
} // these are valid for 8 hours, so you should setup a system that will schedule new reqeuests

//var paypal_access_token = await getAccessToken();

const createPayment = (amount, redirect_url, cancel_url) => {
    return paypal_api.post('/v1/payments/payment', {
        intent: 'sale',
        payer: {
            payment_method: 'paypal',
        },
        transactions: [
            {
                amount: {
                    total: amount,
                    currency: 'USD'
                }
            }
        ],
        redirect_url: {
            return_url: redirect_url,
            cancel_url: cancel_url
        }
    }, {
        headers: {
            //Authorization: `Bearer ${paypal_access_token.access_token}`
            Authorization: `Basic ${paypal_clientid}:${paypal_secret}`
        }
    })
}

const executePayment = (amount, payment_id, payer_id, redirect_url, cancel_url) => {
    return paypal_api.post(`/v1/payments/payment/${payment_id}/execute`, {
        payer_id: payer_id,
        transactions: [
            {
                amount: {
                    total: amount,
                    currency: 'USD'
                }
            }
        ],
        redirect_url: {
            return_url: redirect_url,
            cancel_url: cancel_url
        }
    }, {
        headers: {
            Authorization: `Basic ${paypal_clientid}:${paypal_secret}`
        }
    })
}

module.exports = {createPayment, executePayment}