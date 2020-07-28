const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {password_saltRounds} = require('../data/server-config');

const Schema = mongoose.Schema;

const UserModel = new Schema(
    {
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true },

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
        bcrypt.hash(this.password, password_saltRounds,
            function(err, hashedPassword) {
                if (err) {
                    next(err);
                } else {
                    this.password = hashedPassword;
                    next();
                }
            });
    } else {
        next();
    }
});

module.exports = mongoose.model( 'user_data', UserModel );