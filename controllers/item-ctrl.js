const StoreItem = require('../models/item-model');

createItem = (req, res) => {
    /*
    TODO: add input sanitization here
    TODO: add support for thumbnail image settings
    */
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'Request body missing',
        });
    }

    const store_item = new StoreItem(body);

    if (!store_item) {
        return res.status(400).json({success: false, error: 'Issue parsing item'});
    }

    store_item
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: store_item._id,
                message: 'Item created',
            });
        })
        .catch(error => {
            return res.status(500).json({
                error,
                message: 'Item could not be created',
            });
        })
}

/*
Update calls should be executed asynchonusly so that two entries
do not both write to the same record at teh same time.
*/
updateItem = async (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'Request body missing',
        });
    }

    StoreItem.findOne({_id: req.params.id }, (err, item) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Item not found',
            });
        }

        item.name = body.name;
        item.reviews = body.reviews;
        item.description = body.description;
        item
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: item._id,
                    message: 'Item update',
                });
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Item not update',
                });
            });
    })
}

//DeleteItems should be executed asynchronusly
deleteItem = async (req, res) => {
    await StoreItem.findOneAndDelete({_id: req.params.id}, (err, item) => {
        if (err) {
            return res.status(400).json({success: false, error: err});
        }

        if (!item) {
            return res
                .status(404)
                .json({success: false, error: `Item not found`});
        }

        return res.status(200).json({ success: true, data: item});
    }).catch(err => console.log(err));
}

getItemById = async (req, res) => {
    await StoreItem.findOne({ _id: req.params.id }, (err, item) => {
        if (err) {
            return res.status(400).json({success: false, error: err});
        }

        if (!item) {
            return res
                .status(404)
                .json({ success: false, error: `Item not found`});
        }
        return res.status(200).json({ success: true, data: item });
    }).catch(err => console.log(err));
}

getItems = async (req, res) => {
    await StoreItem.find({}, (err, items) => {
        if (err) {
            return res.status(400).json({ success: false, error: err});
        }

        if (!items.length) {
            return res
                .status(404)
                .json({ success: false, error: `Item not found`});
        }
        return res.status(200).json({ success: true, data: items});
    }).catch(err => console.log(err));
}

module.exports = {
    createItem,
    updateItem,
    deleteItem,
    getItemById,
    getItems
}