const express = require('express');
const midupload = require('../Middleware/upload.js');
const {
  createDesta,
  createDest,
  deleteDest,
  getDestByName,
  getDestMain,
  getDestinationsInternational,
  getDestinationsNorthIndia,
  getDestinationsSouthIndia,
  getDestsall,
  updateDestById
} = require('../Controllers/dest.js');
const multer = require('multer');
const upload = multer(); 

const router = express.Router();

router.get("/main", getDestMain);
router.get('/southindia', getDestinationsSouthIndia);
router.get('/northindia', getDestinationsNorthIndia);
router.get('/international', getDestinationsInternational);
router.get("/", getDestsall);
router.post("/createdesta",upload.any(), createDesta);
router.post("/createdest", midupload.upload.fields([{name: 'coverimage'}]), createDest);
router.patch("/updatedest/:id", midupload.upload.fields([{name: 'coverimage'}]), updateDestById);
router.get("/:name", getDestByName);
router.delete("/:id", deleteDest);

module.exports = router;