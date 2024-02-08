const express = require('express');
const { getTourByDate, ToursByDate,getTrekByDate } = require('../Controllers/dates.js');

const router = express.Router();

router.get("/tours", ToursByDate);
router.get("/tour/:date", getTourByDate); 
router.get("/trek/:date", getTrekByDate);// Endpoint to get tour by date
 // Endpoint to get all tour dates

module.exports = router;