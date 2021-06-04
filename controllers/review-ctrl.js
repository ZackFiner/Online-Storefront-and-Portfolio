const UserReviewModel = require('../models/review-model');
const StoreItem = require('../models/item-model');

const {sanitizeForTinyMCE, sanitizeForMongo, ObjectSanitizer} = require('./sanitization');

const ReviewSanitizer = new ObjectSanitizer({
    author: (auth) => {return sanitizeForMongo(sanitizeForTinyMCE(auth));},
    reviewText: (text) => {return sanitizeForMongo(sanitizeForTinyMCE(text));},
    rating: (rate) => {return sanitizeForMongo(sanitizeForTinyMCE(rate));}
});

createReview = async (req, res) => {
    const raw_body = req.body;
    const id = sanitizeForMongo(req.params.id);
    if (!raw_body) {
        return res.status(400).json({
            success: false,
            error: 'Request body missing'
        });
    }
    const body = ReviewSanitizer.sanitizeObject(raw_body);
    
    // const review = new UserReviewModel(body);
    StoreItem.findOneAndUpdate({_id: id},
        {$push: {reviews: body}})
        .then(() => {
            return res.status(201).json({
                success: true,
                message: 'Review Created'
            });
        }).catch(error => {
            console.log(error);
            return res.status(500).json({
                success: false,
                error: 'An error occurred while processing request'
            })
        })
}

deleteReview = async (req, res) => {
    const id = sanitizeForMongo(req.params.id);
    const reviewId = sanitizeForMongo(req.params.reviewId);

    StoreItem.findOneAndUpdate({_id: id},
        { $pull: { reviews: { _id: reviewId } } }
    ).then(() => {
        return res.status(200).json({success: true})
    }).catch(error => {
        console.log(error);
        return res.status(500).json({succes: false, error: "An error occurred while processing request"});
    })
}

getReviewById = async (req, res) => {
    const id = sanitizeForMongo(req.params.id);
    const reviewId = sanitizeForMongo(req.params.reviewId);

    StoreItem.findOne( {_id: id}, (err, item) => {
        if (err) {
            console.log(error)
            return res.status(500).json({success: false, error: "An error occurred while processing request",});
        }
        const review = item.reviews.find(elem => elem._id==reviewId);
        if (!item | !review) {
            return res.status(404).json({success: false, error: `No item with that id or review was found`});
        }
        return res.status(200).json({success: true, data: review});
    });
}

module.exports = {
    createReview,
    deleteReview,
    getReviewById,
};