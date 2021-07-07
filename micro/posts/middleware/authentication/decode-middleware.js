const jwt = require('jsonwebtoken');

const withAuthMiddleware = (secret, verify_options) => (req, res, next) => {
    const token = req.cookies.token; // remember, we saved this to the client on login

    if (!token) {
        res.status(401).send('Unauthorized: No token was provided');
    } else {
        jwt.verify(token, secret, verify_options, (err, decoded) => {
            if (err) {
                res.status(401).send('Unauthorized: invalid token');
            } else {
                req.authdata = { ...decoded.authdata };
                next();
            }
        });
    }
}

module.exports = withAuthMiddleware;