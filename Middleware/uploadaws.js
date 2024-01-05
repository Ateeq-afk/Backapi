const { S3Client } = require('@aws-sdk/client-s3')
const multer = require('multer')
const multerS3 = require('multer-s3')
const dotenv = require('dotenv');
dotenv.config();
// const app = express()

const REGION = process.env.REGION; // e.g. 'us-west-2'
const ACCESS_KEY_ID = process.env.ACCESS_KEY;
const SECRET_ACCESS_KEY = process.env.SECRET_KEY;

const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});
const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'bpu-images-v1',
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        const filename = `${file.fieldname}-${file.originalname}`;
        const fullPath = `uploads/${filename}`;
        console.log("Uploading file to S3 with path: ", fullPath);
        cb(null, fullPath);
      }
    })
  });
  
  module.exports = { upload };
