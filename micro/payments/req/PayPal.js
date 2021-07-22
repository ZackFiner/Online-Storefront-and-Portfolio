const axios = require('axios');
const {paypal_api, paypal_clientid, paypal_secret} = require('../data/server-config');

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

    static async createPayment(amount, redirect_url, cancel_url) {
        if (!api_auth || (Date.now() - api_auth_refresh.getTime()) > TOKEN_REFRESH)
            await this.initAuth();
        
        return paypal_api_ax.post('/v1/payments/payment', {
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
                Authorization: `Bearer ${api_auth.data.access_token}`,
                'content-type': 'application/json'
            }
        })
    }
    
    static async executePayment(amount, payment_id, payer_id, redirect_url, cancel_url) {
        if (!api_auth || (Date.now() - api_auth_refresh.getTime()) > TOKEN_REFRESH)
            await this.initAuth();

        return paypal_api_ax.post(`/v1/payments/payment/${payment_id}/execute`, {
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
                Authorization: `Bearer ${api_auth.data.access_token}`
            }
        })
    }

}

const createPayment = (amount, redirect_url, cancel_url) => {
    return paypal_api_ax.post('/v1/payments/payment', {
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
    return paypal_api_ax.post(`/v1/payments/payment/${payment_id}/execute`, {
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

module.exports = {PayPalSingleton, createPayment, executePayment}