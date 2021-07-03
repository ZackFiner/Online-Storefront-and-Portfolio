const jwt = require('jsonwebtoken');
const {api_secret, sign_options} = require('../data/server-config');

const generateAPIToken = (authdata) => {
    const token = jwt.sign({
        authdata: {
            ...authdata,
            issuing_service: 'API_PAYMENTS'
        }
    }, api_secret, sign_options)
    return token;
}

module.exports = {generateAPIToken};