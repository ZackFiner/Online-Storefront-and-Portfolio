const ImageModel = require('../models/img-model');


getImage = (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({
            success: false,
            error: 'Id must be specified'
        });
    }
    await ImageModel.findOne( {_id: id }, (err, item) => {
        if (err) {
            return res.status(400).json({
                success: false,
                error: err,
            })
        }

        if (!item) {
            return res.status(404).json({
                success: false,
                error: 'Item not found',
            })
        }
        return res.status(200).json({
            success:true,
            data: item,
        })
    }).catch( error => {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: 'Server error, please try again',
        })
    })
}

getImages = async (req, res) => {
    const body = req.body;
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'Request body missing',
        })
    }
    const imageIds = body.imageIds; // this should be an array of strings corresponding to desired array
    if (!imageIds || imageIds.length <= 0) {
        return res.status(400).json({
            success: false,
            error: 'Request body must contain an imageIds field, which is an array of desired image ids',
        })
    }
    await ImageModel.find({_id: { $in: imageIds }}, (err, items) => {
        if (err) {
            return res.status(400).json({
                succes: false,
                error: err,
            });
        }

        if (!items.length) {
            return res.status(404).json({
                success: false,
                error: 'No images found'
            });
        }
        return res.status(200).json({
            success: true,
            data: items,
        });
    }).catch( error => {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: 'Server error, please try again',
        })
    });
}

module.exports = {
    getImage,
    getImages,
}