const express = require('express');
const midupload = require('../Middleware/upload.js');
const {
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

const router = express.Router();

router.get("/main", getDestMain);
router.get('/southindia', getDestinationsSouthIndia);
router.get('/northindia', getDestinationsNorthIndia);
router.get('/international', getDestinationsInternational);
router.get("/", getDestsall);
router.post("/createdest", midupload.upload.fields([{name: 'coverimage'}]), createDest);
router.patch("/updatedest/:id", midupload.upload.fields([{name: 'coverimage'}]), updateDestById);
router.get("/:name", getDestByName);
router.delete("/:id", deleteDest);

module.exports = router;