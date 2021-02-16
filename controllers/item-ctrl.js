const StoreItem = require('../models/item-model');

const {sanitizeForTinyMCE, sanitizeForMongo, ObjectSanitizer} = require('./sanitization');

const ItemSanitizer = new ObjectSanitizer({
    name: (name) => {return sanitizeForMongo(sanitizeForTinyMCE(name))},
    reviews: (reviews) => {return reviews.map((r)=>sanitizeForMongo(sanitizeForTinyMCE(r)));},
    gallery_images: (id) => {return id},
    description: (desc) => {return sanitizeForMongo(sanitizeForTinyMCE(desc));},
    keywords: (keywords) => {return keywords.map(k => sanitizeForMongo(sanitizeForTinyMCE(k)));},
    thumbnail_img: id => {return id},
    price: (price) => {return sanitizeForMongo(sanitizeForTinyMCE(price));},
    categories: (cata) => {return cata.map(c => sanitizeForMongo(sanitizeForTinyMCE(c)));}
})

createItem = async (req, res) => {
    /*
    TODO: add input sanitization here
    TODO: add support for thumbnail image settings
    */
    const raw_body = JSON.parse(req.body.body); // because this is packaged as a multipart form, the body is strinfied

    if (!raw_body) {
        return res.status(400).json({
            success: false,
            error: 'Request body missing',
        });
    }


    const body = ItemSanitizer.sanitizeObject(raw_body);

    const store_item = new StoreItem(body);
    if (!store_item) {
        return res.status(400).json({success: false, error: 'Issue parsing item'});
    }

    if (req.files['selectedThumbnail'] && req.files['selectedThumbnail'][0]) { //if the user specified a file
        try {
            store_item.thumbnail_img = req.files['selectedThumbnail'][0];
        } catch (error) {
            console.error(error);
        }
    }

    if (req.files['galleryImages']) {
        for(let file of req.files['galleryImages']) {
            try {
                store_item.gallery_images.push(file);
            } catch (error) {
                console.error(error);
            }
        }
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
    const raw_body = JSON.parse(req.body.body);

    if (!raw_body) {
        return res.status(400).json({
            success: false,
            error: 'Request body missing',
        });
    }

    const body = ItemSanitizer.sanitizeObject(raw_body);
    const id = sanitizeForMongo(req.params.id);
    let item;
    try {
        item = await StoreItem.findOne({_id: id }).exec();
        if (!item) {
            return res.status(404).json({
                err,
                message: 'Item not found',
            });
        }
    } catch (err) {
        return res.status(404).json({
            err,
            message: 'Item not found',
        });
    }

    try {
        for (let [key, value] of Object.entries(body)) {
            // we only update the entries provided: the front end need not include every entry if it isn't changed
            item.set(key, value);
        }
    } catch (error) {
        // assuming the syntax above is valid, we should send a 400 error if the request
        // specifies some parameters modification that's not part of the schema
    }


    // following this logic, the client should only send files when they are changing/adding them
    if (req.files['selectedThumbnail'] && req.files['selectedThumbnail'][0]) { //if the user specified a file
        try {
            item.thumbnail_img = req.files['selectedThumbnail'][0];
        } catch (error) {
            console.error(error);
        }
    }

    if (req.files['galleryImages']) {
        for(let file of req.files['galleryImages']) {
            try {
                item.gallery_images.push(file);
            } catch (error) {
                console.error(error);
            }
        }
    }

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
}

//DeleteItems should be executed asynchronusly
deleteItem = async (req, res) => {
    const id = sanitizeForMongo(req.params.id);

    await StoreItem.findOneAndDelete({_id: id}, (err, item) => {
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
    const id = sanitizeForMongo(req.params.id);

    await StoreItem.findOne({ _id: id }, (err, item) => {
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
            return res.status(500).json({ success: false, error: err});
        }

        if (!items.length) {
            return res
                .status(404)
                .json({ success: false, error: `Item not found`});
        }

        return res.status(200).json({ success: true, data: items});

    }).catch(err => console.log(err));
}

searchItems = async (req, res) => {
    const raw_body = req.body;
    if (!raw_body) {
        return res.status(400).json({success: false, error: "No body provided"});
    }
    const searchtext = sanitizeForMongo(sanitizeForTinyMCE( raw_body.searchtext ));

    if (!searchtext) {
        return res.status(400).json({success: false, error: "No search text provided"});
    }

    await StoreItem.find(
        {$text: {$search: searchtext}}, // search our text index
        {score: {$meta: "textScore"}}) // project the $meta text score field  
        .sort({score: { $meta: "textScore"}})
    .then((items) => {
        return res.status(200).json({ success: true, data: items});

    }).catch(err => console.log(err));
}

module.exports = {
    createItem,
    updateItem,
    deleteItem,
    getItemById,
    getItems,
    searchItems
}