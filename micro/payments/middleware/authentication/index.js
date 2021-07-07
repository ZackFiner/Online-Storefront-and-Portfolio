const withAuthMiddleware = require('./decode-middleware');
const withHeaderAuthMiddleware = require('./decode-header-middleware');
const {secret, api_secret, verify_options} = require('../../data/server-config');
const withAuth = withAuthMiddleware(secret, verify_options)
const withAPIAuth = withHeaderAuthMiddleware(api_secret, verify_options);

module.exports = {withAuth, withAPIAuth};