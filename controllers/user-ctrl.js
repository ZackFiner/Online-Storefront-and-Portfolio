const UserModel = require("../models/user-model");
const jwt = require('jsonwebtoken');
const {secret} = require('../data/server-config');

createUser = (req, res) => {
    const body = req.body
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'Request body missing'
        })
    }

    const userAccount = new UserModel(body);

    if (!userAccount) {
        return res.status(400).json({
            success: false,
            error: 'Issue parsing request',
        })
    }

    userAccount
    .save()
    .then(() => {
        return res.status(201).json({
            success: true,
            message: 'User account successfully created'
        })
    }).catch( (err) => {
        return res.status(500).json({
            success: false,
            error,
            message: 'User account could not be created due to interal server error',
        })
    } )
}

authUser = (req, res) => {
    const body = req.body;
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'Request body missing',
        })
    }

    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            error: 'Request must include a user email and password',
        })
    }

    UserModel.findOne( { email }, (err, user) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                error: 'Internal error, please try again'
            })
        } else if (!user) {
            return res.status(401).json({
                success: false,
                error: `Incorrect email or password`
            })
        } else {
            user.isCorrectPassword(password, (err, same) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        error: 'Internal error, please try again'
                    })
                } else if (!same) {
                    return res.status(401).json({
                        success: false,
                        error: `Incorrect email or password`,
                    })
                } else {
                    // Give them the token
                    const payload = { email };
                    const token = jwt.sign(payload, secret, {
                        expiresIn: '1h'
                    });
                    return res.cookie('token', token, {httpOnly: true}).sendStatus(200);
                }
            })
        }
    })
}

module.exports = {createUser, authUser}
