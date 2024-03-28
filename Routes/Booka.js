const express = require('express');
const {  initiatepayment,webhook,getTodaysBookings, getTrekRecommendations, getTourRecommendations,getBookingsByEmail,getBookingWithTour } = require('../Controllers/booka.js');

const router = express.Router();


router.post('/initiatePayment', initiatepayment);
router.post('/webhook', webhook);
router.get("/todaybook",getTodaysBookings)
router.get('/treks/:email', getTrekRecommendations);
router.get('/tours/:email', getTourRecommendations);
router.get('/user/:email', getBookingsByEmail);
router.get('/full/:bookingId', getBookingWithTour);

module.exports = router;