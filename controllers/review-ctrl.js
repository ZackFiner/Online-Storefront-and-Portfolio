const UserReviewModel = require('../models/review-model');
const StoreItem = require('../models/item-model');

const {sanitizeForTinyMCE, sanitizeForMongo, ObjectSanitizer} = require('./sanitization');

const ReviewSanitizer = new ObjectSanitizer({
    itemId: (id) => {return sanitizeForMongo(sanitizeForTinyMCE(id));},
    author: (auth) => {return sanitizeForMongo(sanitizeForTinyMCE(auth));},
    reviewText: (text) => {return sanitizeForMongo(sanitizeForTinyMCE(text));},
    rating: (rate) => {return sanitizeForMongo(sanitizeForTinyMCE(rate));}
});

createReview = async (req, res) => {
    const raw_body = req.body;

    if (!raw_body) {
        return res.status(400).json({
            success: false,
            error: 'Request body missing'
        });
    }
    const body = ReviewSanitizer.sanitizeObject(raw_body);
    
    const review = new UserReviewModel(body);

    if (!review) {
        return res.status(400).json({
            success: false,
            error: 'Issue parsing request',
        })
    }

    review
        .save()
        .then( (value) => {
            // update the corresponding item to have the review on it
            StoreItem.findOneAndUpdate({_id: value.itemId},
                {$push: {reviews: value._id}}).then( () => {
    
            return res.status(201).json({
                success: true,
                message: 'Review Created'
            })})
        })
        .catch( error => {
            console.log(error);
            return res.status(500).json({
                error,
                message: 'Review could not be created'
            })
        })
}

deleteReview = async (req, res) => {
    const id = sanitizeForMongo(req.params.id);

    await UserReviewModel.findOneAndDelete( {_id: id}, (err, item) => {
        if (err) {
            return res.status(400).json({ success: false, error: err,});
        }
        
        if (!item) {
            return res.status(400).json({ success: false, error: 'No such review exists'});
        }
        // find the corresponding item entry and remove this review from its list
        StoreItem.findOneAndUpdate({_id: id}, 
            {$pop: {reviews: item._id}}).then(() => {

        return res.status(200).json({success: true, data: item});
    })
    }).catch(error => {
        console.log(error);
    })
}

getReviewById = async (req, res) => {
    const id = sanitizeForMongo(req.params.id);
    await UserReviewModel.findOne( {_id: id}, (err, item) => {
        if (err) {
            return res.status(400).json({success: false, error: err,});
        }

        if (!item) {
            return res.status(400).json({success: false, error: `Review ${id} could not be found`});
        }
        return res.status(200).json({success: true, data: item});
    }).catch(error => {
        console.log(error);
    });
}

module.exports = {
    createReview,
    deleteReview,
    getReviewById,
};