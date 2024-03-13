const express = require("express");
const AttractionController = require("../Controllers/attraction.js")
const multer = require('multer');
const upload = multer(); 

const router = express.Router();


router.post("/createattraction",  upload.any(), AttractionController.createAttraction);

router.get('/', AttractionController.getAttractionsAll);

module.exports = router;