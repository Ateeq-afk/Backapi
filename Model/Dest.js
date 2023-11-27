const mongoose = require("mongoose");
const DestSchema = new mongoose.Schema(
  {
    name: { type: String },
    coverimage:  { type: String },
    maintype: { type: String },
    urllink: { type: String },
    over: [String],
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trek' }],
    blogs : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }]
  },
  { timestamps: true }
)
module.exports = mongoose.model("Dest", DestSchema);