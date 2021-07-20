const StoreItem = require('../models/item-model');
const {inventory_queue} = require('../data/server-config');
const {MQSingleton} = require('../mq');
const {sanitizeForTinyMCE, sanitizeForMongo, ObjectSanitizer} = require('./sanitization');
const {prep_image_s3} = require('./helpers');

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
            console.log(req.files['selectedThumbnail'][0]);
            store_item.thumbnail_img = prep_image_s3(req.files['selectedThumbnail'][0]);
        } catch (error) {
            console.error(error);
        }
    }

    if (req.files['galleryImages']) {
        for(let file of req.files['galleryImages']) {
            try {
                store_item.gallery_images.push(prep_image_s3(file));
            } catch (error) {
                console.error(error);
            }
        }
    }
    
    store_item
        .save()
        .then(async () => {
            await MQSingleton.sendMessageToQueue(inventory_queue, {
                action: "CREATE",
                content: {
                    item_name: store_item.name,
                    item_desc_id: store_item._id,
                    qty: 1,
                    price: store_item.price
                }
            });
            return res.status(201).json({
                success: true,
                id: store_item._id,
                message: 'Item created',
            });
        })
        .catch(error => {
            console.log(error);
            return res.status(500).json({
                success: false,
                error: 'An error occurred while processing request',
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
                success: false,
                error: 'Item not found',
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(404).json({
            success: false,
            error: 'An error occurred while processing request'
        });
    }

    try {
        for (let [key, value] of Object.entries(body)) {
            // we only update the entries provided: the front end need not include every entry if it isn't changed
            item.set(key, value);
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            error: 'Request body could not be parsed'
        })
    }


    // following this logic, the client should only send files when they are changing/adding them
    if (req.files['selectedThumbnail'] && req.files['selectedThumbnail'][0]) { //if the user specified a file
        try {
            item.thumbnail_img = prep_image_s3(req.files['selectedThumbnail'][0]);
        } catch (error) {
            console.error(error);
        }
    }

    if (req.files['galleryImages']) {
        for(let file of req.files['galleryImages']) {
            try {
                item.gallery_images.push(prep_image_s3(file));
            } catch (error) {
                console.error(error);
            }
        }
    }

    item
        .save()
        .then(async () => {
            if (body.hasOwnProperty("name") || body.hasOwnProperty("price"))
                await MQSingleton.sendMessageToQueue(inventory_queue, {
                    action: "UPDATE",
                    content: {
                        item_name: item.name,
                        price: item.price,
                        item_desc_id: item._id
                    }
                });
            
            return res.status(200).json({
                success: true,
                id: item._id,
                message: 'Item update',
            });
        })
        .catch(error => {
            console.log(error);
            return res.status(404).json({
                success: false,
                error: 'Item not update',
            });
        });
}

//DeleteItems should be executed asynchronusly
deleteItem = async (req, res) => {
    const id = sanitizeForMongo(req.params.id);

    await StoreItem.findOneAndDelete({_id: id}, async (err, item) => {
        if (err) {
            console.log(err);
            return res.status(500).json(
                {
                    success: false, 
                    error: 'An error occurred while processing request'
                });
        }

        if (!item) {
            return res
                .status(404)
                .json({success: false, error: `Item not found`});
        }
        await MQSingleton.sendMessageToQueue(inventory_queue, {
            action: "DELETE",
            content: {
                id: id
            }
        });
        return res.status(200).json({ success: true, data: item});
    })
}

getItemById = async (req, res) => {
    const id = sanitizeForMongo(req.params.id);

    await StoreItem.findOne({ _id: id }, (err, item) => {
        if (err) {
            console.log(err);
            return res.status(500).json(
                {
                    success: false, 
                    error: 'An error occurred while processing request'
                });
        }

        if (!item) {
            return res
                .status(404)
                .json({ success: false, error: `Item not found`});
        }

        return res.status(200).json({ success: true, data: item });

    })
}

getItems = async (req, res) => {
    await StoreItem.find({}, (err, items) => {
        if (err) {
            return res.status(500).json({ success: false, error: 'An error occurred while processing request'});
        }

        if (!items.length) {
            return res
                .status(404)
                .json({ success: false, error: `Item not found`});
        }

        return res.status(200).json({ success: true, data: items});

    })
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

    }).catch(err => {
        console.log(err)
        return res.status(500).json({success: false, error: 'An error occurred while processing request'})
    });
}

module.exports = {
    createItem,
    updateItem,
    deleteItem,
    getItemById,
    getItems,
    searchItems
}