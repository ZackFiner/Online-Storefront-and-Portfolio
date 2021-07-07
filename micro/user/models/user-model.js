const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {password_saltRounds} = require('../data/server-config');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true },
        roles: {type: [String], required: true}
    },
    {timestamps: true},
);

UserSchema.methods.isCorrectPassword = function( password, callback ) {
    bcrypt.compare( password, this.password, function( err, same ) {
        if (err) {
            callback(err);
        } else {
            callback(err, same);
        }
    });
}

UserSchema.pre('save', function(next) { // use a hook to hash the plain text password being sent from the front end
    if (this.isNew || this.isModeified('password')) {
        const document = this; // we need to save parent function state (the document itself)
        if (!document.roles) { // if the user is not assigned to any role, add them to the default role
            document.roles = ['ROLE_USER'];
        }
        bcrypt.hash(document.password, password_saltRounds,
            function(err, hashedPassword) {
                if (err) {
                    next(err);
                } else {
                    document.password = hashedPassword;
                    next();
                }
            });
    } else {
        next();
    }
});
const UserModel = mongoose.model( 'user_datas', UserSchema );
module.exports = UserModel;