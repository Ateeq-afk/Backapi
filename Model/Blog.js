const mongoose = require("mongoose");
const BlogSchema = new mongoose.Schema(
  {
    name: { type: String },
    urllink: { type: String },
    over: [String],
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trek' }],
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
    }]
  },
  { timestamps: true }
)
module.exports = mongoose.model("Blog", BlogSchema);