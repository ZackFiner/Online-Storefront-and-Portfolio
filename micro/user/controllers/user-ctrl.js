const UserModel = require("../models/user-model");
const jwt = require('jsonwebtoken');
const {secret, sign_options} = require('../data/server-config');

const {sanitizeForMongo, ObjectSanitizer, sanitizeHtml} = require('./sanitization');
const AccountSanitizer = new ObjectSanitizer({
    email: (email) => {return sanitizeForMongo(sanitizeHtml(email))},
    password: (pw) => {return sanitizeForMongo(sanitizeHtml(pw))}
});

createUser = (req, res) => {
    const raw_body = req.body
    if (!raw_body) {
        return res.status(400).json({
            success: false,
            error: 'Request body missing'
        })
    }
    const body = AccountSanitizer.sanitizeObject(raw_body);

    const userAccount = new UserModel(body);
    userAccount.roles.push('ROLE_ADMIN');
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
        console.log(err);
        return res.status(500).json({
            success: false,
            error: 'An error occurred while processing request'
        })
    } )
}

authUser = (req, res) => {
    const raw_body = req.body;
    if (!raw_body) {
        return res.status(400).json({
            success: false,
            error: 'Request body missing',
        })
    }
    const body = AccountSanitizer.sanitizeObject(raw_body);
    
    const {email, password} = body;

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
                error: 'An error occurred while processing request'
            })
        } else if (!user) {
            return res.status(401).json({
                success: false,
                error: `Incorrect email or password`
            })
        } else {
            user.isCorrectPassword(password, (err, same) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        success: false,
                        error: 'An error occurred while processing request'
                    })
                } else if (!same) {
                    return res.status(401).json({
                        success: false,
                        error: `Incorrect email or password`,
                    })
                } else {
                    const payload = { // Give them the token, which we'll attach some user account info to
                        userdata: {
                            _id: user._id,
                            email: email,
                            roles: user.roles,
                        }
                    };
                    const token = jwt.sign(payload, secret, sign_options); // cookies will expire 6 minutes from when they are set, we will need
                    // to implement an auto refresh feature on the front end or users will be logged out after 6 minutes

                    return res.cookie('token', token, {httpOnly: true}).sendStatus(200);
                }
            })
        }
    })
}

userLogOut = (req, res) => {
    res.clearCookie('token', {path:'/', httpOnly: true});
    return res.sendStatus(200);
}

function processUserData(userData) {
    return {
        _id: userData._id,
        email: userData.email,
        roles: userData.roles,
        // any other fields you want go here, thumbnail image, etc.
    };
}

getUserData = async (req, res) => { // this should not use req.userdata: this could be modified by the user
    // instead, it should use the encrypted jwt token which (in theory) cannot be modified by the user.
    // otherwise, someone could access other user's user data.

    const userdata = req.userdata; // extract from a jwt token
    if (!userdata) {
        return res.status(400).json({
            success: false,
            error: 'Request must include basic userdata (userid and email)'
        })
    }

    UserModel.findById(userdata._id, (err, user) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                error: 'An error occurred while processing request'
            })
        } else if (!user) {
            return res.status(404).json({
                success: false,
                error: `The information for user ${userdata._id} could not be found`
            })
        } else {
            res.status(200).json(processUserData(user));
        }
    })
}

refreshUserToken = (req, res) => {
    if (req.userdata) {// if the user has been authenticated and currently posesses a valid token
        const payload = {userdata: { ... req.userdata } }
        const token = jwt.sign(payload, secret, { // create a new session token with more time
            expiresIn: '6m' // refresh the expiration time to give the user another 6 minutes
        });
        // we keep the cookie as a session cookie so that it is delete when the browser is closed.
        return res.cookie('token', token, {httpOnly: true}).sendStatus(200);
    } else {
        res.status(403).json({success: false, error:"No user data provided."})
    }

}


module.exports = {createUser, getUserData, authUser, userLogOut, refreshUserToken};
