const mongoose = require("mongoose");

const AttractionSchema = new mongoose.Schema({
    name: { type: String },
    coverimage: { type: String },
    coverimagealt: { type: String },
    type: { type: String },
    urllink: { type: String },
    metatitle: { type: String },
    metades: { type: String },
    destination: { type: String },
    over: [String],
    content: [{
        title: { type: String },
        para: { type: String },
        imagealt: { type: String },
        image: { type: String }
    }],
    faq: [{
        question: { type: String },
        answer: { type: String }
    }],
    AttractionType: { type: String },
    reach: { type: String },
    label: { type: String },
    timings: { type: String },
    timeRequired: { type: String },
    entryFee: { type: String },
    attraction: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attraction' }],
    mustattraction: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attraction' }],
    activity: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }], 
    bloga: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }],
}, { timestamps: true });

module.exports = mongoose.model("Attraction", AttractionSchema);
