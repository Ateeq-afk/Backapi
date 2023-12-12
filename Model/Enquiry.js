const mongoose = require("mongoose");
const EnquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    password: {
        type: String,
    },
    message: {
        type: String,
    },
    callback:{
      type: String,
  },
  source:{
    type: String,
},
  },
  { timestamps: true }
);
module.exports = mongoose.model("Enquiry", EnquirySchema);