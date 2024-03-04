const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema(
  {
    name: { type: String },
    coverimage: { type: String },
    coverimage2: { type: String },
    coverimage3: { type: String },
    coverimage4: { type: String },
    coverimage5: { type: String },
    coverimage6: { type: String },
    coverimagealt: {type: String },
    coverimagealt2: {type: String },
    coverimagealt3: {type: String },
    coverimagealt4: {type: String },
    coverimagealt5: {type: String },
    coverimagealt6: {type: String },
    urllink: {type: String},
    metatitle: { type: String},
    metades : { type: String},
    destination: {type:String},
    type: {type:String},
    amount: { type: Number },
    fromamount: { type: Number },
    booking: [{
        bookingname: { type: String },
        duration: { type: String },
        fromamount: { type: Number },
        amount: { type: Number }
    }],
    desc: [String],
    days: [{
        day: {
            type: String,
        },
        cityName: {
            type: String,
        },
        description: [String],
        meals: {
            type: String,
        },
        image: {
            type: String,
        },
        imagealt: {
          type: String,
        }
    }],
    highlight: [String],
    over: [String],
    confirmation: [String],
    cancellation: [String],
    faq:  [{
        question: {
            type: String,
        },
        answer: {
            type: String,
        },
    }],
    similar: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }],
    blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }],
    related: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }],
} ,{ timestamps: true })

module.exports = mongoose.model("Activity", ActivitySchema);