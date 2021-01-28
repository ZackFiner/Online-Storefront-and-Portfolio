const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostModel = new Schema({
    header: {type: String, required: true},
    content: {type: String, required: true},
    index: {type: Number, required: false}
},
{timestamps: true});

module.exports = mongoose.model('frontpage_posts', PostModel);