const express = require("express");
const ActivityController = require("../Controllers/activities.js")
const multer = require('multer');
const upload = multer(); 

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
router.post("/createactivity", 
    upload.any(), ActivityController.createActivity);
router.post("/createstays", upload.any(), ActivityController.createStays);



module.exports = router;