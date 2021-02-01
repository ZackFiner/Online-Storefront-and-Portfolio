const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StoreItemSchema = new Schema(
    {
        name: {type: String, required: true},
        reviews: {type: [mongoose.Types.ObjectId], required: true},
        gallery_images: {type: [mongoose.Types.ObjectId], required: false},
        description: {type: String, required: true},
        keywords: {type: [String], required: false},
        thumbnail_img: {type: mongoose.Types.ObjectId, required: false},
        price: {type: mongoose.Types.Decimal128, required: false},
        categories: {type: [String], required: true, default:['misc']}
    },
    {timestamps: true},
)

// create a compound index for our item schema to allow full-text search
StoreItemSchema.index(
    {
        name:'text',
        keywords: 'text',
        description: 'text'
    },
    {
        name: 'default_search_index',
        weights: {
            name: 10,
            keywords: 5,
            description: 3,
        }
    });

const StoreItem = mongoose.model('store_items', StoreItemSchema);
module.exports = StoreItem;
