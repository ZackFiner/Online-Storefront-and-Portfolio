const PostModel = require('../models/frontpage-post-model');
const {sanitizeForTinyMCE, sanitizeForMongo, ObjectSanitizer} = require('./sanitization');

const PostSanitizer = new ObjectSanitizer({
    header: (h) => {return sanitizeForMongo(sanitizeForTinyMCE(h));},
    content: (c) => {return sanitizeForMongo(sanitizeForTinyMCE(c));},
    index: (i) => {return !isNaN(parseInt(i)) ? parseInt(i) : undefined}
});

const createPost = (req, res) => {
    // TODO: these are gunna need image upload support, since
    // the user will need to be able to post images
    const body = req.body;
    if (!body) {
        return res.status(400).json({
            success: false,
            error: `No body was provided`
        });
    }
    const sanitized_body = PostSanitizer.sanitizeObject(body);
    const raw_header = body.header;
    const raw_content = body.content;
    if (!raw_header || !raw_content) {
        return res.status(400).json({
            success: false,
            error: `Body was missing crucial data`
        });
    }

    // sanitize both inputs below
    const header = sanitizeForMongo(sanitizeForTinyMCE(raw_header));
    const content = sanitizeForMongo(sanitizeForTinyMCE(raw_content));
    

    const post = new PostModel({header, content});
    post.save().then(value => {
        if (value) {
            return res.status(200).json({
                success: true,
                id: value._id
            })
        } else {
            return res.status(500).json({
                success: false,
                error: `An error occured while processing request`
            })
        }
    }).catch(error => {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: `An error occured while processing request`
        });
    });
}

const uploadImage = (req, res) => {
    if (req.files['selectedImage'] && req.files['selectedImage'][0]) {
        const value = req.files['selectedImage'][0];
        
        if (value) {
            const new_post = new PostModel({
                header: '',
                content: `<img src='${value.path}' \\>`,
                images: [value]
            });
            new_post.save()
            .then(value => {
                if (value)
                    return res.status(200).json({
                        success: true,
                        id: value._id,
                    })
                else
                    throw new Error("Couldn't create post");
            }).catch(error => {
                console.log(error);
                return res.status(500).json({
                    success: false,
                    error: `An error occured while processing request`
                });
            });
        } else {
            return res.status(500).json({
                success: false,
                error: `An error occured while processing request`
            });
        }

    }
    return res.status();
}

const editPost = (req, res) => {
    const body = req.body;
    const raw_id = req.params.id;
    if (!body || !raw_id) {
        return res.status(400).json({
            success: false,
            error: `Body or id not specified`
        });
    }

    const raw_header = body.header;
    const raw_content = body.content;
    const raw_index = body.index;
    const sanitized_body = PostSanitizer.sanitizeObject(body);
    // sanitize
    const header = raw_header ? sanitizeForMongo(sanitizeForTinyMCE(raw_header)) : undefined;
    const content = raw_content ? sanitizeForMongo(sanitizeForTinyMCE(raw_content)) : undefined;
    const index = isNaN(parseInt(raw_index)) ? undefined : parseInt(raw_index); // type coercion sanitzation

    const id = sanitizeForMongo(raw_id);

    PostModel.findOne({_id: id}, (err, value)=>{
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                error: `An error occured while processing request`
            });
        }
        if (!value) {
            return res.status(404).json({
                success: false,
                error: `No document with that id exists`
            });
        }
        if (header)
            value.header = header;
        if (content)
            value.content = content;
        if (index)
            value.index = index;
        
        value.save().then(doc => {
            if (doc) {
                return res.status(200).json({
                    success: true,
                    id: doc._id
                });
            } else {
                return res.status(500).json({
                    success: false,
                    error: 'An error occured while processing request'
                });
            }
        }).catch(error => {
            console.log(error);
            return res.status(500).json({
                success: false,
                error: 'An error occured while processing request'
            });
        });
    });
}

const deletePost = (req, res) => {
    raw_id = req.params.id;
    if (!raw_id) {
        return res.status(400).json({
            success: false,
            error: 'No post ID specified',
        })
    }
    id = sanitizeForMongo(raw_id);

    PostModel.findOneAndDelete({_id: id}, (err, value) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                error: 'An error occured while processing request'
            });
        }
        
        if (!value) {
            return res.status(404).json({
                success: false,
                error: `No document with that id exists`
            });
        }

        return res.status(200).json({
            success: true,
            data: value,
        })
    }).catch(error => {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: 'An error occured while processing request'
        });
    });
}

const getPost = (req, res) => {
    const raw_id = req.params.id;
    if (!raw_id) {
        return res.status(400).json({
            success: false,
            error: 'Id not specified'
        });
    }
    const id = sanitizeForMongo(raw_id);

    PostModel.findOne({_id: id}, (err, value)=>{
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                error: 'An error occured while processing request'
            });
        }

        if (!value) {
            return res.status(404).json({
                success: false,
                error: `No document with that id exists`
            });
        }

        return res.status(200).json({
            success: true,
            data: value,
        });
    }).catch(error => {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: 'An error occured while processing request'
        });
    });
}

const getPosts = (req, res) => {
    PostModel.find({})
    .sort({index: 1})
    .exec()
    .then((value)=>{
        return res.status(200).json({
            success: true,
            data: value ? value : [],
        })
    }).catch(error => {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: 'An error occured while processing request'
        });
    })
}

module.exports = {
    createPost,
    uploadImage,
    editPost,
    deletePost,
    getPost,
    getPosts
}