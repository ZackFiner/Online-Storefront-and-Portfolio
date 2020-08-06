const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StoreItem = new Schema(
    {
        name: {type: String, required: true},
        reviews: {type: [mongoose.Types.ObjectId], required: true},
        gallary_images: {type: [mongoose.Types.ObjectId], required: false},
        description: {type: String, required: true},
        thumbnail_img: {type: mongoose.Types.ObjectId, required: false},
    },
    {timestamps: true},
)

module.exports = mongoose.model('store_items', StoreItem);