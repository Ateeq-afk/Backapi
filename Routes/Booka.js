const express = require('express');
const {  initiatepayment,webhook,getTodaysBookings } = require('../Controllers/booka.js');

const router = express.Router();


router.post('/initiatePayment', initiatepayment);
router.post('/webhook', webhook);
router.get("/todaybook",getTodaysBookings)

module.exports = router;