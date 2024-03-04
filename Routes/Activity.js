const express = require("express");
const ActivityController = require("../Controllers/activities.js")
const { upload } = require('../Middleware/uploadaws.js');

const router = express.Router();

router.post("/createactivity", upload.fields([
    { name: 'coverimage' },
    { name: 'coverimage2' },
    { name: 'coverimage3' },
    { name: 'coverimage4' },
    { name: 'coverimage5' },
    { name: 'coverimage6' },
    ...Array.from({ length: 10 }, (_, i) => ({ name: `dayImage[${i}]` }))
]), ActivityController.createActivity);
router.post("/createstays", upload.fields([
    { name: 'coverimage' },
    { name: 'coverimage2' },
    { name: 'coverimage3' },
    { name: 'coverimage4' },
    { name: 'coverimage5' },
    { name: 'coverimage6' },
]), ActivityController.createStays);
router.get('/', ActivityController.getActivitysall);

module.exports = router;