const withAuthMiddleware = require('./decode-middleware');
const {secret, api_secret, verify_options} = require('../../data/server-config');
const withAuth = withAuthMiddleware(secret, verify_options)
const withAPIAuth = withAuthMiddleware(api_secret, verify_options);

module.exports = {withAuth, withAPIAuth};