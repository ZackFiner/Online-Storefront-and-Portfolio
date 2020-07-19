const UserReviewModel = require('../models/review-model');
const StoreItem = require('../models/item-model');

createReview = async (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'Request body missing'
        });
    }

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
    await UserReviewModel.findOneAndDelete( {_id: req.params.id}, (err, item) => {
        if (err) {
            return res.status(400).json({ success: false, error: err,});
        }
        
        if (!item) {
            return res.status(400).json({ success: false, error: 'No such review exists'});
        }
        // find the corresponding item entry and remove this review from its list
        StoreItem.findOneAndUpdate({_id: req.params.id}, 
            {$pop: {reviews: item._id}}).then(() => {

        return res.status(200).json({success: true, data: item});
    })
    }).catch(error => {
        console.log(error);
    })
}

getReviewById = async (req, res) => {
    await UserReviewModel.findOne( {_id: req.params.id}, (err, item) => {
        if (err) {
            return res.status(400).json({success: false, error: err,});
        }

        if (!item) {
            return res.status(400).json({success: false, error: `Review ${req.params.id} could not be found`});
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