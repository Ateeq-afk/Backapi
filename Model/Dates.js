const mongoose = require('mongoose');

const tourDateSchema = new mongoose.Schema({
  date: { type: String },
  tourId: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Trek' 
  }],
  trekId: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Trek'  
  }]
});

module.exports = mongoose.model('Date', tourDateSchema);