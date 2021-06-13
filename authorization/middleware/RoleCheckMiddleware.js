const jwt = require('jsonwebtoken');
require('../../boot');
const { restart } = require('nodemon');
const {secret} = require('../../data/server-config');

const RoleCheckMiddleware = (role_id) => (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).send('Unauthorized: No token was provided')
    } else {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                return res.status(401).send('Unauthorized: invalid token');
            } else {
                const roles = decoded.userdata.roles; // retrieve the roles from the decoded jwt
                if (roles && roles.length > 0) {
                    if (roles.includes(role_id)) {
                        next();
                    } else {
                        return res.status(403).send('Unauthorized: access denied')
                    }
                }
            }
        });
    }
}

module.exports = RoleCheckMiddleware;