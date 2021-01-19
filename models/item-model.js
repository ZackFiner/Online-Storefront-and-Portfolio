const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StoreItemSchema = new Schema(
    {
        name: {type: String, required: true},
        reviews: {type: [mongoose.Types.ObjectId], required: true},
        gallery_images: {type: [mongoose.Types.ObjectId], required: false},
        description: {type: String, required: true},
        thumbnail_img: {type: mongoose.Types.ObjectId, required: false},
    },
    {timestamps: true},
)


const StoreItem = mongoose.model('store_items', StoreItemSchema);
module.exports = StoreItem;
