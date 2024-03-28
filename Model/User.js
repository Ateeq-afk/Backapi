const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true
    },
    phone: {
      type: Number,
    },
    preferredDestinations:{
      type: String,
    },
    travelertype:{
      type: String,
    },
    password: {
      type: String,
    },
    image: {
      type: String,
    },
    verifytoken:{
      type: String,
    },
    fromGoogle: {
      type: Boolean,
      default: false,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },
    zipCode: {
      type: String,
    },
    address: {
      type: String,
    },
    wishlist: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trek'
    }],    
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", UserSchema);
