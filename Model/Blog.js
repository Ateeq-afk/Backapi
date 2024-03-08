const mongoose = require("mongoose");
const BlogSchema = new mongoose.Schema(
  {
    name: { type: String },
    urllink: { type: String },
    title: {type: String},
    coverimage: {type: String},
    coverimagealt: {type: String},
    destination: {type:String},
    type: {type: String },
    time:{
      type: String 
    },
    date: {
      type: String
    },
    photo: {
      type: String
    },
    photoname:{
      type: String
    },
    metatitle: { type: String},
    metades : { type: String},
    over: [String],
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trek' }],
    tourproducts:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trek' }],
    bloga:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }],
    blogs : [{
        title: {
            type: String,
        },
        para: {
            type: String,
        },
        image: {
            type: String,
        },
        imagealt: {
          type: String,
        }
    }],
    blog: [{
      title: {
        type: String,
      },
      para: {
        type: String, 
      },
      image: {
        type: String,
      },
      imagealt: {
          type: String,
        }
    }], 
    blogproduct:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }],
    activityproduct:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }],
    // blogproduct: [{
    //   refId: { type: mongoose.Schema.Types.ObjectId},
    //   refType: { type: String, enum: ['Blog', 'Activity'], }
    // }],
  },
  { timestamps: true }
)
module.exports = mongoose.model("Blog", BlogSchema);