const express = require("express");
const AttractionController = require("../Controllers/attraction.js")
const { upload } = require('../Middleware/uploadaws.js');

const router = express.Router();


router.post("/createattraction", upload.fields([
    { name: 'coverimage' },
    ...Array.from({ length: 10 }, (_, i) => ({ name: `contentImage[${i}]` }))
]), AttractionController.createAttraction);

router.get('/', AttractionController.getAttractionsAll);

module.exports = router;