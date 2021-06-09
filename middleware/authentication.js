const jwt = require('jsonwebtoken');
const {secret, verify_options} = require('../data/server-config');

const withAuth = (req, res, next) => {
    const token = req.cookies.token; // remember, we saved this to the client on login

    if (!token) {
        res.status(401).send('Unauthorized: No token was provided');
    } else {
        jwt.verify(token, secret, verify_options, (err, decoded) => {
            if (err) {
                res.status(401).send('Unauthorized: invalid token');
            } else {
                req.userdata = { ...decoded.userdata };
                next();
            }
        });
    }
}

module.exports = withAuth;