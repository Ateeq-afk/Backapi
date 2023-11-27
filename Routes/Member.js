const express = require('express');
const { initiatememberpayment, savemember, verifymemberpayment } = require('../Controllers/member.js');

const router = express.Router();

router.post("/initiatePayment", initiatememberpayment);
router.post("/verifyPayment", verifymemberpayment);
router.post("/savePayment", savemember);

module.exports = router;