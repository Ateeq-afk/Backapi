const express = require('express');
const { initiatepayment, savepayment, verifypayment } = require('../Controllers/book.js');

const router = express.Router();

router.post('/initiatePayment', initiatepayment);
router.post('/verifyPayment', verifypayment);
router.post('/savePayment', savepayment);

module.exports = router;