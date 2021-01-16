const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserReviewSchema = new Schema(
    {
        itemId: {type: mongoose.Types.ObjectId, required: true},
        author: {type: String, required: true},
        reviewText: {type: String, required: true},
        rating: {type: Number, min: 0, max: 10, required: true},
    },
    {timestamps: true},
)
const UserReviewModel = mongoose.model('user_reviews', UserReviewSchema);
module.exports = UserReviewModel;
