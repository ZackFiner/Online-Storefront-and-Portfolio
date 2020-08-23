const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {password_saltRounds} = require('../data/server-config');
const defaultRoleId = '';
const Schema = mongoose.Schema;

const UserModel = new Schema(
    {
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true },
        roles: {type: [mongoose.Types.ObjectId], required: true}
    },
    {timestamps: true},
);

UserModel.methods.isCorrectPassword = function( password, callback ) {
    bcrypt.compare( password, this.password, function( err, same ) {
        if (err) {
            callback(err);
        } else {
            callback(err, same);
        }
    });
}

UserModel.pre('save', function(next) { // use a hook to hash the plain text password being sent from the front end
    if (this.isNew || this.isModeified('password')) {
        const document = this; // we need to save parent function state (the document itself)
        bcrypt.hash(document.password, password_saltRounds,
            function(err, hashedPassword) {
                if (err) {
                    next(err);
                } else {
                    document.password = hashedPassword;
                    next();
                }
            });
        if (!document.roles) { // if the user is not assigned to any role, add them to the default role
            document.roles = [defaultRoleId];
        }
    } else {
        next();
    }
});

module.exports = mongoose.model( 'user_datas', UserModel );