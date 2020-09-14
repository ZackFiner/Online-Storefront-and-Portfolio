const mongoose = require('mongoose');
const {RoleAccessor, hasPermission, ROLE_CONSTANTS} = require('../authorization');
const StoreItem = require('./item-model');
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

const REVIEW_CREATE = 'REVIEW_CREATE';
const REVIEW_DELETE = 'REVIEW_DELETE';
const REVIEW_READ = 'REVIEW_READ';

class UserReviewAccessor extends RoleAccessor {
    static async createReview(role_data, review_document) {
        if (hasPermission(role_data, REVIEW_CREATE, '')) {
            try {
                const review = new UserReviewModel(review_document);
                if (!review) {
                    return {
                        success: false,
                        error: 'Issue parsing request',
                    }
                }
                const saved_doc = await review.save();
                // update the corresponding item to have the review on it
                await StoreItem.findOneAndUpdate({_id: saved_doc.itemId},
                    {$push: {reviews: saved_doc._id}});
                return {
                    success: true,
                    data: saved_doc,
                };
            } catch (err) {
                return {
                    success: false,
                    error: err,
                }
            }
        } else {
            return { success: false, error: 'User lacks Permission'};
        }
    }

    static async deleteReview(role_data, id) {
        if (hasPermission(role_data, REVIEW_DELETE, id)) {
            try {
                const item = await UserReviewModel.findOneAndDelete({_id: id}) // review or item id?
                if (!item) {
                    return {
                        success: false,
                        error: 'No such review exists',
                    };
                }
                // find the corresponding item entry and remove this review from its list
                await StoreItem.findOneAndUpdate({_id: id}, 
                        {$pop: {reviews: item._id}});
            
                return {
                    success: true, 
                    data: item,
                };
            } catch (err) {
                return {
                    success: false,
                    error: err,
                }
            }
        } else {
            return { success: false, error: 'User lacks Permission'};
        }
    }

    static async getReviewById(role_data, id) {
        if (hasPermission(role_data, REVIEW_READ, id)) {
            try {
                const item = await UserReviewModel.findOne( {_id: id});
                if (!item) {
                    return {
                        success: false,
                        error: `Review ${id} could not be found`
                    };
                }
                return {
                    success: true,
                    data: item
                };
            } catch (err) {
                return {
                    success: false,
                    error: err,
                }
            }
        } else {
            return { success: false, error: 'User lacks Permission'};
        }
    }

}