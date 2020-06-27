const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserReviewModel = new Schema(
    {
        author: {type: String, required: true},
        reviewText: {type: String, required: true},
    },
    {timestamps: true},
)

module.exports = mongoose.model('user_review', UserReviewModel);