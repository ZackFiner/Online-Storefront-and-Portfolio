const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StoreItem = new Schema(
    {
        name: {type: String, required: true},
        reviews: {type: [String], required: true},
        description: {type: String, required: true},
    },
    {timestamps: true},
)

module.exports = mongoose.model('store_items', StoreItem);