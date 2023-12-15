const express = require('express');
const {  initiatepayment,webhook } = require('../Controllers/booka.js');

const router = express.Router();


router.post('/initiatePayment', initiatepayment);
router.post('/webhook', webhook);


module.exports = router;