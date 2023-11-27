const express = require('express');
const {
  signup,
  signin,
  googleAuth,
  passwordLink,
  forgotPassword
} = require('../Controllers/user.js');

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/google', googleAuth);
router.post('/passwordlink', passwordLink);
router.post('/forgotpassword/:id/:token', forgotPassword);

module.exports = router;