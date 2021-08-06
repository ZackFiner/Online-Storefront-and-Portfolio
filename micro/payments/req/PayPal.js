const axios = require('axios');
const {paypal_api, paypal_clientid, paypal_secret} = require('../data/server-config');
const {v4: uuidv4} = require('uuid');
const paypal_api_ax = axios.create({
    baseURL: paypal_api
});

var api_auth = undefined;
var api_auth_refresh = undefined;
var TOKEN_REFRESH = 60*60*1000*8;

const getAccessToken = () => {
    return paypal_api_ax.post('/v1/oauth2/token', {
        
    }, {
        headers: {
            'Accept': 'application/json',
            'Accept-Language': 'en_US',
            'content-type': 'application/x-www-form-urlencoded'
        },
        auth: {
            username: paypal_clientid,
            password: paypal_secret
        },
        params: {
            grant_type: 'client_credentials'
        }
    });
} // these are valid for 8 hours, so you should setup a system that will schedule new reqeuests

class PayPalSingleton {
    static async initAuth() {
        console.log("REQUESTING API TOKEN")
        const resp = await getAccessToken();
        console.log(`REQUEST STATUS: ${resp.status}`);
        api_auth = resp;
        api_auth_refresh = new Date(); // set when this token was refreshed
        
    }

    static async createOrder(amount, order_info, redirect_url, cancel_url) {
        if (!api_auth || (Date.now() - api_auth_refresh.getTime()) > TOKEN_REFRESH)
            await this.initAuth();
        
        return paypal_api_ax.post('/v2/checkout/orders', {
            intent: 'CAPTURE',

            purchase_units: [
                {
                    amount: {
                        value: amount,
                        currency_code: 'USD',
                        breakdown: {
                            item_total: {
                                currency_code: "USD",
                                value: amount,
                            },
                            shipping: {
                                currency_code: "USD",
                                value: 0, // CHANGE THIS
                            },
                            tax_total: {
                                currency_code: "USD",
                                value: 0 // change this
                            },
                            discount: {
                                currency_code: "USD",
                                value: 0
                            }
                        }
                    },
                    items: order_info.items.map(item => ({
                        quantity: item.quantity,
                        name: item.name,
                        unit_amount: {
                            value: item.price,
                            currency_code: 'USD'
                        }
                    }))/*[
                        {
                            quantity: order_info.items[0].quantity,
                            name: order_info.items[0].name,
                            unit_amount: {
                                value: order_info.items[0].price,
                                currency_code: 'USD'
                            }
                        }
                    ]*/
                    
                }
            ],
        }, {
            headers: {
                Authorization: `Bearer ${api_auth.data.access_token}`,
                'content-type': 'application/json'
            }
        })
    }
    
    static async authorizeOrder(order_id, payer_id) {
        if (!api_auth || (Date.now() - api_auth_refresh.getTime()) > TOKEN_REFRESH)
            await this.initAuth();

        return paypal_api_ax.post(`/v2/checkout/orders/${order_id}/authorize`, {
        }, {
            headers: {
                Authorization: `Bearer ${api_auth.data.access_token}`,
                "PayPal-Request-Id": uuidv4()
            }
        })
    }
}

module.exports = {PayPalSingleton}