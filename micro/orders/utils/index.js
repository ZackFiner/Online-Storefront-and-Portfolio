const jwt = require('jsonwebtoken');
const {api_secret, sign_options} = require('../data/server-config');

const generateAPIToken = () => {
    const token = jwt.sign({
        authdata: {
            issuing_service: 'API_ORDERS'
        }
    }, api_secret, sign_options)
    return token;
}

module.exports = {generateAPIToken};