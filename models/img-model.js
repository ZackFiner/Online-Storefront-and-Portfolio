const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageModel = new Schema(
    {
        filename: {type: String, required: true},
        fieldname: {type: String, required: false},
        encoding: {type: String, required: false},
        mimetype: {type: String, required: true},
        path: {type: String, required: true},
        size: {type: Number, required: false},
    },
    {timestamps: true},
);

module.exports = ImageModel;