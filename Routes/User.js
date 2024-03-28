const express = require('express');
const {
  signup,
  signin,
  googleAuth,
  passwordLink,
  forgotPassword,
  GetUserDetails, UpdateUserDetails,SaveWish,DeleteWish 
} = require('../Controllers/user.js');

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/google', googleAuth);
router.post('/passwordlink', passwordLink);
router.post('/forgotpassword/:id/:token', forgotPassword);
router.get('/get/:email', GetUserDetails);
router.put('/update/:email', UpdateUserDetails);
router.post('/wishlist/:email/:trekName', SaveWish);
router.delete('/wishlist/:email/:trekName', DeleteWish);

module.exports = router;