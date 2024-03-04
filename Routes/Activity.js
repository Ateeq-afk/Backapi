const express = require("express");
const ActivityController = require("../Controllers/activities.js")
const { upload } = require('../Middleware/uploadaws.js');

const router = express.Router();

router.get('/activity', ActivityController.getActivity);
router.get('/stays', ActivityController.getActivityStays);
// router.get('/activity', async (req, res, next) => {
//     try {
//         const activities = await Activity.find({ type: 'activity' });
//         res.status(200).json({ success: true, data: activities });
//     } catch (err) {
//         res.status(500).json({ success: false, error: err.message });
//     }
// });

// // Define the route for getting all stays
// router.get('/stays', async (req, res, next) => {
//     try {
//         const stays = await Activity.find({ type: 'stays' });
//         res.status(200).json({ success: true, data: stays });
//     } catch (err) {
//         res.status(500).json({ success: false, error: err.message });
//     }
// });

router.get('/', ActivityController.getActivitysall);
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



module.exports = router;