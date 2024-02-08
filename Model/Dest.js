const mongoose = require("mongoose");
const DestSchema = new mongoose.Schema(
  {
    name: { type: String },
    order: {type:Number},
    content: {type: String},
    location: {type: String},
    rankingstatement:{type: String},
    duration:{type: String},
    season:{type: String},
    destinationtype:{type: String},
    coverimage:  { type: String },
    coverimagealt: {type: String},
    metatitle: { type: String},
    metades : { type: String},
    maintype: { type: String },
    urllink: { type: String },
    over: [String],
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trek' }],
    blogs : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }]
  },
  { timestamps: true }
)
module.exports = mongoose.model("Dest", DestSchema);