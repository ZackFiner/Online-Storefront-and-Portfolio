 const prep_image_s3 = (file) => {
    const {fieldname, encoding, mimetype, size, key, location} = file;
    return {
        filename: key,
        fieldname: fieldname,
        encoding: encoding,
        mimetype: mimetype,
        path: location,
        size: size,
    }
}
module.exports = {prep_image_s3}