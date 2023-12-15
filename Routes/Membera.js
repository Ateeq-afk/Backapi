const express = require('express');
const {  initiatememberpayment, memberWebhook } = require('../Controllers/membera.js');

const router = express.Router();


router.post('/initiatePayment', initiatememberpayment);
router.post('/webhook', memberWebhook);


module.exports = router;