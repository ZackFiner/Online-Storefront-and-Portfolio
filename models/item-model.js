const mongoose = require('mongoose');
const ImageModel = require('./img-model');
const {RoleAccessor, hasPermission, ROLE_CONSTANTS} = require('../authorization');
const Schema = mongoose.Schema;

const StoreItemSchema = new Schema(
    {
        name: {type: String, required: true},
        reviews: {type: [mongoose.Types.ObjectId], required: true},
        gallery_images: {type: [mongoose.Types.ObjectId], required: false},
        description: {type: String, required: true},
        thumbnail_img: {type: mongoose.Types.ObjectId, required: false},
    },
    {timestamps: true},
)
const StoreItem = mongoose.model('store_items', StoreItemSchema);
module.exports = StoreItem;

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

const ITEM_CREATE = 'ITEM_CREATE';
const ITEM_READ = 'ITEM_READ';
const ITEM_UPDATE = 'ITEM_UPDATE';
const ITEM_DELETE = 'ITEM_DELETE';


class StoreItemAccessor extends RoleAccessor {
    static async getItems(role_data) {
        if (hasPermission(user_roles, ITEM_READ, '')) {
            try {
                await StoreItem.find({}, (err, items) => {
                    if (err) {
                        return { success: false, error: err};
                    }
            
                    if (!items.length) {
                        return { success: false, error: `Item not found`};
                    }
            
                    Promise.all(items.map(item => packageMedia(item)))
                    .then( packagedItems => {
                        return { success: true, data: packagedItems};
                    });
                });
            } catch (err) {
                return { success: false, error: err};
            }
        } else {
            return { success: false, error: 'User lacks Permission'};
        }
    }

    static async getItemById(role_data, id) {
        if (hasPermission(role_data, ITEM_READ, id)) {
            try {
                await StoreItem.findOne({ _id: req.params.id }, (err, item) => {
                    if (err) {
                        return {success: false, error: err};
                    }
            
                    if (!item) {
                        return { success: false, error: `Item not found`};
                    }
                    packageMedia(item)
                    .then((value) => {
                        return { success: true, data: value };
                    });
                });
            } catch (err) {
                return { success: false, error: err};
            } 
        } else {
            return { success: false, error: 'User lacks Permission'};
        }
    }

    static createItem(role_data, document) {
        if (hasPermission(role_data, ITEM_CREATE, '')) {
            try {
                const store_item = new StoreItem(document);
                if (!store_item) {
                    return {success: false, error: 'Issue parsing item'};
                }

                await store_item.save();
                return {
                    success: true,
                    data: store_item._id,
                };
            } catch(err) {
                return {success: false, error:err};
            }
        } else {
            return { success: false, error: 'User lacks Permission'};
        }
    }

    static async deleteItem(role_data, id) {
        if (hasPermission(role_data, ITEM_DELETE, '')) {
            try {
                const item = await StoreItem.findOneAndDelete({_id: req.params.id});
                if (!item) {
                    return {success: false, error: `Item not found`};
                }
                return { success: true, data: item};
            } catch(err) {
                return {success: false, error: err};
            }
        } else {
            return { success: false, error: 'User lacks Permission'};
        }
    }

    static async updateItem(role_data, id, changes) {
        if (hasPermission(role_data, ITEM_UPDATE, id)) {
            try {
                let item = await StoreItem.findOne({_id: req.params.id }).exec();
                if (!item) {
                    return {
                        success: false,
                        error: 'Item not found',
                    };
                }

                for (let [key, value] of Object.entries(changes)) {
                    // we only update the entries provided: the front end need not include every entry if it isn't changed
                    item.set(key, value);
                }

                await item.save();
                return {
                    success: true,
                    data: item._id,
                };
            } catch(err) {
                return {success: false, error:err};
            }
        } else {
            return { success: false, error: 'User lacks Permission'};
        }
    }
}