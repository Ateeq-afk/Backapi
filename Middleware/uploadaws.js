const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const s3 = new aws.S3({
    accessKeyId:"AKIAQ4K3CQ5H57COY7HD",
    secretAccessKey: "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",
    region: 'eu-north-1'
});


const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'bpu-images-v1', // replace with your S3 bucket name
        acl: 'public-read', // adjust the access control as needed
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            const folder = 'uploads/'; // set your folder name
            const filename = Date.now().toString() + '-' + file.originalname;
            cb(null, folder + filename); // files will be saved in the 'uploads' folder
        }
    })
});

module.exports = { upload };