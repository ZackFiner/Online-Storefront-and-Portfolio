const StoreItem = require('../models/item-model');
const ImageModel = require('../models/img-model');


async function packageMedia(storeItem) {
    let packagedItem = new StoreItem(storeItem).toObject(); // this is already making me uncomfortable, hopefully this syntax is valid for documents
    try {
        if (storeItem.gallery_images) {
            // so Mongoose queries are NOT promises, but they do have then() methods for convenience
            // to get a query promise, you need to use the .exec() function
            // The wiki states that awaiting the promise via exec() yields a nicer stack trace on errors
            const unpackedItems = await ImageModel.find({ _id:{ $in: storeItem.gallery_images }}).exec();
            packagedItem.gallery_images = unpackedItems;
        }
        if (storeItem.thumbnail_img) {
            
            const unpackedThumbnail = await ImageModel.findOne({_id: storeItem.thumbnail_img}).exec();
            packagedItem.thumbnail_img = unpackedThumbnail;
        }
    } catch (error) {
        console.error(`Failed to package media for item ${storeItem._id}: ${error.message}`);
    }
    return packagedItem;
}

async function grabAndPackItem(id) {
    retrieved_item = await StoreItem.findOne({_id:id});
    if (retrieved_item) {
        return packageMedia(retrieved_item);
    }
}3

async function grabAndPackItems(ids = null) {
    if (ids) {
        let retrievedItems = await StoreItem.find({ _id: {$in: ids} })
        return Promise.all(retrievedItems.map( (item) => packageMedia(item)));
    } else {
        let retrievedItems = await StoreItem.find({});
        return Promise.all(retrievedItems.map( (item) => packageMedia(item)));
    }
}

createItem = async (req, res) => {
    /*
    TODO: add input sanitization here
    TODO: add support for thumbnail image settings
    */
    const body = JSON.parse(req.body.body); // because this is packaged as a multipart form, the body is strinfied

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

    if (req.files['selectedThumbnail'][0]) { //if the user specified a file
        const image_media = new ImageModel(req.files['selectedThumbnail'][0]);
        if (image_media) {
            try {
                const saved_image = await image_media.save();
                store_item.thumbnail_img = saved_image._id;
            } catch (error) {
                console.error(error);
            }
        }
    }

    if (req.files['galleryImages']) {
        const outer = this;
        for(let file of req.files['galleryImages']) {
            const image_media = ImageModel(file);
            if (image_media) {
                try {
                    const saved_image = await image_media.save();
                    store_item.gallery_images.push(saved_image._id);
                } catch (error) {
                    console.error(error);
                }
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
    const body = JSON.parse(req.body.body);

    /*******************************************************************************
     * Special Considerations:
     * 
     * > How do we handle media changes (adding/removing images for example)?
     *      > If an image is removed, should we simply de-couple the image object
     *        or actually delete the image and the image object from our DB?
     *      > If an image is added, how do we limit the number of gallary images
     *        someone can upload without forcing them to completly re-send all
     *        all images, or using a modified middleware instead of multer.
     * 
     * > Should the front end send the full copy of the item document back? Why not
     *   simply send back a set of modifications which can be handled on this end?
     * 
     *******************************************************************************/
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'Request body missing',
        });
    }
    let item;
    try {
        item = await StoreItem.findOne({_id: req.params.id }).exec();
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
        const image_media = new ImageModel(req.files['selectedThumbnail'][0]);
        if (image_media) {
            try {
                const saved_image = await image_media.save();
                item.thumbnail_img = saved_image._id;
            } catch (error) {
                console.error(error);
            }
        }
    }

    if (req.files['galleryImages']) {
        const outer = this;
        for(let file of req.files['galleryImages']) {
            const image_media = ImageModel(file);
            if (image_media) {
                try {
                    const saved_image = await image_media.save();
                    item.gallery_images.push(saved_image._id);
                } catch (error) {
                    console.error(error);
                }
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
        packageMedia(item)
        .then((value) => {
            return res.status(200).json({ success: true, data: value });
        });
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

        Promise.all(items.map(item => packageMedia(item)))
        .then( packagedItems => {
            return res.status(200).json({ success: true, data: packagedItems});
        });
    }).catch(err => console.log(err));
}

searchItems = async (req, res) => {
    const body = JSON.parse(req.body.body);
    if (!body) {
        return res.status(400).json({success: false, error: "No body provided"});
    }
    const searchtext = body.searchtext;

    if (!searchtext) {
        return res.status(400).json({success: false, error: "No search text provided"});
    }

    await StoreItem.find(
        {$text: {$search: searchtext}}, // search our text index
        {score: {$meta: "textScore"}}) // project the $meta text score field  
        .sort({score: { $meta: "textScore"}})
    .then((err, items) => {
        if (err) {
            return res.status(500).json({ success: false, error: err });
        }

        Promise.all(items.map(item => packageMedia(item)))
        .then( packagedItems => {
            return res.status(200).json({ success: true, data: packagedItems});
        });
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