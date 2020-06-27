const UserReviewModel = require('../models/review-model');

createReview = (req, res) => {
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
        .then( () => {
            res.status(201).json({
                success: true,
                message: 'Review Created'
            })
        })
        .error( error => {
            res.status(500).json({
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
        res.status(200).json({success: true, data: item});
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
        res.status(200).json({success: true, data: item});
    }).catch(error => {
        console.log(error);
    });
}

module.exports = {
    createReview,
    deleteReview,
    getReviewById,
};