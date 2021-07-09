const mongoose = require('mongoose');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
//const {CloudinaryStorage} = require('multer-storage-cloudinary');
const {cloudinary_config, mongodb_connection, s3_connection, aws_config, bucket_name} = require('../data/server-config');

const aws = require("aws-sdk");
aws.config.update(aws_config);

const S3Storage = require("multer-s3");
const s3 = new aws.S3(s3_connection);

const { v4: uuidv4 } = require('uuid');

mongoose
    .connect(mongodb_connection, {useNewUrlParser: true,useUnifiedTopology: true,})
    .catch(e => {
        console.error('Connection error', e.message)
    });

mongoose.set('useFindAndModify', false);
const mongoosedb = mongoose.connection;
/*
cloudinary.config(cloudinary_config);
const imageStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "OnlineStorefront",
        //allowedFormats: ["jpg", "png"],
    }
    //transformation: [{ width: 1024, height: 1024, crop:"limit" }]
});
*/

const imageStorage = S3Storage({
    s3: s3,
    bucket: bucket_name,
    metadata: (req, file, callback) => {
        callback(null, {fieldName: file.fieldname});
    },
    key: (req, file, callback) => {
        callback(null, uuidv4());
    }
});

const imageParser = multer({ storage: imageStorage });

module.exports = {mongoosedb, imageParser, imageStorage};