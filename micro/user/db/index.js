const mongoose = require('mongoose');
const {mongodb_connection} = require('../data/server-config')
mongoose
    .connect(mongodb_connection, {useNewUrlParser: true, useUnifiedTopology: true})
    .catch(e => {
        console.error('Connection error', e.message)
    });

mongoose.set('useFindAndModify', false);
const mongoosedb = mongoose.connection;

module.exports = {mongoosedb};