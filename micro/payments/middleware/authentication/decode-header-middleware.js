const jwt = require('jsonwebtoken');

const withAuthHeaderMiddleware = (secret, verify_options) => (req, res, next) => {
    const header = req.headers.authorization; // remember, we saved this to the client on login

    if (!header) {
        res.status(401).send('Unauthorized: No authorization header was provided');
    } else {
        const [token_type, token_credentials] = header.split(" ");
        const token = token_credentials;
        
        if (token_type != "Bearer") { // only accept bearer tokens
            res.status(401).send('Unauthorized: invalid token type');
        }
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

module.exports = withAuthHeaderMiddleware;