const jwt = require('jsonwebtoken');
const {secret} = require('../../data/server-config');

const RoleCheckMiddleware = (role_id) => (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return req.status(401).send('Unauthorized: No token was provided')
    } else {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                return req.status(401).send('Unauthorized: invalid token');
            } else {
                const roles = decoded.roles;
                if (roles && roles.length > 0) {
                    if (role_id in roles) {
                        next();
                    } else {
                        return req.status(403).send('Unauthorized: access denied')
                    }
                }
            }
        });
    }
}

module.exports = RoleCheckMiddleware;