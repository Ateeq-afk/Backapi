const mongoose = require("mongoose");
const DestSchema = new mongoose.Schema(
  {
    name: { type: String },
    location:{ type: String },
    title: {type: String},
    visit:{type: String},
    duration:{type: String},
    desttype:{type: String},
    coverimage:  { type: String },
    coverimagealt: {type: String},
    metatitle: { type: String},
    metades : { type: String},
    maintype: { type: String },
    urllink: { type: String },
    over: [String],
    attpara: { type: String},
    attraction: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attraction' }],
    actpara: { type: String},
    activity: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }],
    staypara: { type: String},
    stay: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }],
    religpara: { type: String},
    religious: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attraction' }],
    camppara: { type: String},
    camping: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }],
    food: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }],
    culture: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }],
    shopping: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }],
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trek' }],
    tourproducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trek' }],
    blogs : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }],
    destination : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dest' }]
  },
  { timestamps: true }
)
module.exports = mongoose.model("Dest", DestSchema);