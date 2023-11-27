const mongoose = require("mongoose");
const MemberSchema = new mongoose.Schema(
  {
    memberId: {
      type: String,
    },
    passtype: {
      type: String,
    },
    batchDate: {
        type: Date,
        default: function () {
          const currentTime = new Date();
          const year = currentTime.getFullYear();
          const month = (currentTime.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-based, so we add 1
          const day = currentTime.getDate().toString().padStart(2, '0');
          
          return `${year}-${month}-${day}`;
        },
    },
  batchTime: {
    type: String, 
    default: function () {
      const currentTime = new Date();
      const hours = currentTime.getHours().toString().padStart(2, '0');
      const minutes = currentTime.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    },
  },
  activationdate: {
    type: String,
  },
  expiringdate: {
    type: String,
  },
  title: {
    type: String,
},
    firstname: {
        type: String,
    },
    lastname: {
        type: String,
    },
    phonenumber: {
        type: String,
    },
    email:{
      type: String,
  },
  amount: {
    type: Number,
},
gst: {
    type: Number, 
},
    totalamount:{
      type: Number,
    },
    razorpayOrderId: {
        type: String, 
    },
    razorpayPaymentId: {
        type: String, 
    }
  },
  { timestamps: true }
);
module.exports = mongoose.model("Member", MemberSchema);