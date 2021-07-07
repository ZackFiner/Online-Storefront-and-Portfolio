const mongoose = require('mongoose');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');
const {cloudinary_config, mongodb_connection} = require('../data/server-config');

mongoose
    .connect(mongodb_connection, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .catch(e => {
        console.error('Connection error', e.message)
    });

mongoose.set('useFindAndModify', false);
const mongoosedb = mongoose.connection;

cloudinary.config(cloudinary_config);
const imageStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "OnlineStorefront",
        //allowedFormats: ["jpg", "png"],
    }
    //transformation: [{ width: 1024, height: 1024, crop:"limit" }]
});
const imageParser = multer({ storage: imageStorage });

module.exports = {mongoosedb, imageParser, imageStorage};