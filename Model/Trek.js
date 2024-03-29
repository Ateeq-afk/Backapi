const mongoose = require("mongoose");

const TrekSchema = new mongoose.Schema(
  {
    name: { type: String },
    urllink: {type: String},
    metatitle: { type: String},
    metades : { type: String},
    maintype: { type: String },
    statetype: { type: String },
    state: { type: String },
    for: {type: String },
    amount: {type: String},
    fromamount: { type: Number },
    withoutamount : {type: Number},
    reserveamount: {type: Number},
    day: { type: String },
    badge:{ type: String },
    trektype: { type: String },
    trektypename: { type: String },
    testimage: { type:String },
    testimagealt: { type:String },
    level: { type: String },
    levelname: { type: String },
    service: { type: String },
    servicename: { type: String },
    statename: { type: String },
    expertpara: { type: String },
    lead1name: { type: String },
    lead1oc: { type: String },
    lead1pimg: { type: String },
    lead1pimgalt: { type: String },
    lead2name: { type: String },
    lead2oc: { type: String },
    lead2pimg: { type: String },
    lead2pimgalt: { type: String },
    itinerary: { type: String},
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
  expectpara: {
    type: String
  },
  expecthead1: {
    type: String
  },
  expecthead1para:{
    type: String
  },
  expecthead2: {
    type: String
  },
  expecthead2para:{
    type: String
  },
  over: [String],
  included: [String],
  notincluded: [String],
  things:  [String], 
  relatedtreks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trek' }],
  faq:  [{
    question: {
        type: String,
    },
    answer: {
        type: String,
    },
}],
  related: [{
    rday: {
        type: String,
    },
    rname: {
        type: String,
    },
    ramount:  {
      type: Number,
  },
    rimage: {
        type: String,
    },
    rimagealt: {
      type: String,
    },
    rtype: {
      type: String,
  },
  rtypename: {
      type: String,
  },
  rlevel: {
    type: String,
},
rlevelname: {
    type: String,
},
rservice: {
  type: String,
},
rservicename: {
  type: String,
},
rlink: {
  type: String,
},
}],
    batch: [{
      date: {
        type: String,
      },
      amount: {
        type: Number,
      }
    }],
    popularityScore: {
      type: Number,
      default: 0, // Example field for sorting by popularity
    },
   // Assuming this is for upcoming tours/treks
    recommendation: {
      type: Boolean,
      default: false,// Example field for sorting by recommendations
    },
    Upcoming: {
      type: Boolean,
      default: false, // Default value indicating not upcoming
    },
  },
 
  { timestamps: true }
);

module.exports = mongoose.model("Trek", TrekSchema);
// export default mongoose.model("Trek", TrekSchema);