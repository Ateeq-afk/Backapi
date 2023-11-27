const express = require('express');
const { getEnquiry, postEnquiry } = require('../Controllers/enquiry.js');

const router = express.Router();

router.get("/", getEnquiry);
router.post("/save", postEnquiry);

module.exports = router;