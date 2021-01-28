const PostModel = require('../models/frontpage-post-model');
const sanitizeHtml = require('sanitize-html');
const sanitize = require('mongo-sanitize')

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

    const {raw_header, raw_content} = body;
    if (!raw_header || !raw_content) {
        return res.status(400).json({
            success: false,
            error: `Body was missing crucial data`
        });
    }

    // sanitize both inputs below
    const header = sanitize(sanitizeHtml(raw_header));
    const content = sanitize(sanitizeHtml(raw_content));
    

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

const editPost = (req, res) => {
    const body = req.body;
    const raw_id = req.params.id;
    if (!body || !raw_id) {
        return res.status(400).json({
            success: false,
            error: `Body or id not specified`
        });
    }

    const {raw_header, raw_content} = body;

    // sanitize
    const header = raw_header ? sanitize(sanitizeHtml(raw_header)) : undefined;
    const content = raw_content ? sanitize(sanitizeHtml(raw_content)) : undefined;
    const id = sanitize(raw_id);

    PostModel.findOne({_id: id}, (err, res)=>{
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                error: `An error occured while processing request`
            });
        }
        if (!res) {
            return res.status(404).json({
                success: false,
                error: `No document with that id exists`
            });
        }
        if (header)
            res.header = header;
        if (content)
            res.content = content;
        
        res.save().then(value => {
            if (value) {
                return res.status(200).json({
                    success: true,
                    id: value._id
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
    id = sanitize(raw_id);

    PostModel.findOneAndDelete({_id: id}, (err, res) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                error: 'An error occured while processing request'
            });
        }

        if (!res) {
            return res.status(404).json({
                success: false,
                error: `No document with that id exists`
            });
        }

        return res.status(200).json({
            success: true,
            data: res,
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
    const id = sanitize(raw_id);

    PostModel.findOne({_id: id}, (err, res)=>{
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                error: 'An error occured while processing request'
            });
        }

        if (!res) {
            return res.status(404).json({
                success: false,
                error: `No document with that id exists`
            });
        }

        return res.status(200).json({
            success: true,
            data: res,
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
    PostModel.find({}, (err, res)=>{
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                error: 'An error occured while processing request'
            });
        }

        return res.status(200).json({
            success: true,
            data: res ? res : [],
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
    editPost,
    deletePost,
    getPost,
    getPosts
}