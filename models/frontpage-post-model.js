const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ImageModel = require('./img-model');

const PostModel = new Schema({
    header: {type: String, required: false},
    content: {type: String, required: true},
    index: {type: Number, required: true, default:0},
    images: {type: [ImageModel], required: false}
},
{timestamps: true});

PostModel.pre('save', function(next) {
    if (this.isNew) { // if we're adding a new entry
        let new_doc = this;
        _PostModel.find({})
        .sort({index:-1})
        .limit(1)
        .exec((err, doc) => {
            if (err) {
                next(err);
            } else {
                const max_index = doc[0].index;
                new_doc.index = max_index+1;
                next();
            }
        })
    } else {
        next();
    }
});
const _PostModel = mongoose.model('frontpage_posts', PostModel);
module.exports = _PostModel;