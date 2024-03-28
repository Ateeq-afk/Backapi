const Trek = require("../Model/Trek.js");

  const getTreksall = async (req,res,next)=>{
    try {
      const treks = await Trek.find();
      // res.status(200).json(treks);
      res.status(200).json({ success: true, data: treks });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  const tourTypes = ['grouptour', 'longtour', 'international', 'northindiatour','private','specialtour'];
  const trekTypes = ['northindiatrek', 'karnatakatrek', 'keralatrek', 'tntrek','specialtrek'];
  
  // Middleware function to get tours by name
  const getTourByName = async (req, res) => {
    try {
      const linkName = req.params.name;
      const tour = await Trek.findOne({ urllink: linkName, maintype: { $in: tourTypes } }).populate("relatedtreks")
      if (!tour) {
        return res.status(404).json({ error: "Tour not found" });
      }
      res.status(200).json(tour);
    } catch (error) {
      res.status(500).json({ error: "Could not retrieve tour" });
    }
  };
  
  // Middleware function to get treks by name
   const getTrekByName = async (req, res) => {
    try {
      const linkName = req.params.name;
      const trek = await Trek.findOne({  urllink: linkName, maintype: { $in: trekTypes } }).populate("relatedtreks")
      if (!trek) {
        return res.status(404).json({ error: "Trek not found" });
      }
      res.status(200).json(trek);
    } catch (error) {
      res.status(500).json({ error: "Could not retrieve trek" });
    }
  };
  const getTour = async (req, res) => {
    try {
        const tour = await Trek.find({ maintype: { $in: tourTypes } }).select('name urllink');
      if (!tour) {
        return res.status(404).json({ error: "Tour not found" });
      }
      res.status(200).json(tour);
    } catch (error) {
      res.status(500).json({ error: "Could not retrieve tour" });
    }
  };
  
  // Middleware function to get treks by name
   const getTrek = async (req, res) => {
    try {
        const trek = await Trek.find({ maintype: { $in: trekTypes } }).select('name urllink');
      if (!trek) {
        return res.status(404).json({ error: "Trek not found" });
      }
      res.status(200).json(trek);
    } catch (error) {
      res.status(500).json({ error: "Could not retrieve trek" });
    }
  };
  const getTourfull = async (req, res) => {
    try {
        const tour = await Trek.find({ maintype: { $in: tourTypes } })
      if (!tour) {
        return res.status(404).json({ error: "Tour not found" });
      }
      res.status(200).json(tour);
    } catch (error) {
      res.status(500).json({ error: "Could not retrieve tour" });
    }
  };
  
  // Middleware function to get treks by name
   const getTrekfull = async (req, res) => {
    try {
        const trek = await Trek.find({ maintype: { $in: trekTypes } })
      if (!trek) {
        return res.status(404).json({ error: "Trek not found" });
      }
      res.status(200).json(trek);
    } catch (error) {
      res.status(500).json({ error: "Could not retrieve trek" });
    }
  };
  
  
 const getTrekById = async (req, res) => {
  try {
    const id = req.params.id;
    // const Trekdata = await Trek.findById(id).populate('batches'); 
     const Trekdata = await Trek.findById(id); 
    if (!Trekdata) {
      return res.status(404).json({ message: 'Data not found' });
    }
    res.status(200).json(Trekdata);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}

 const getTreksMain = async (req, res, next) => {
  try {
    let treks = await Trek.find(
      {},
      {  name: 1 } // Projection: include id and name, exclude _id
    );

    let { q } = req.query;

    if (q) {
      treks = treks.filter(x => x.name.toLowerCase().includes(q));
    }

    res.status(200).json(treks);
  } catch (err) {
    next(err);
  }
};

 const createTrek = async (req, res, next) => {
  try {
    // Extract the trek information from the request body
    const {
      name, amount,testimagealt, fromamount, maintype, urllink, statetype, reserveamount, for1, day,
      trektype, trektypename, level, levelname, service, servicename, state, statename,
      expertpara,itinerary, expectpara, expecthead1, expecthead1para, expecthead2, expecthead2para,
      days, batch 
    } = req.body;
    // console.log(days);
    // if (!req.body.days) {
    //   return res.status(400).send('Days data is missing');
    // }
    
    let daysArray,batchArray;

    if (typeof days === 'string') {
      try {
        daysArray = JSON.parse(days);
      } catch (error) {
        return res.status(400).send('Invalid days data: ' + error.message);
      }
    } else if (days instanceof Array) {
      // If `days` is already an array, no need to parse it
      daysArray = days;
    } else {
      // If `days` is neither a string nor an array, send an error response
      return res.status(400).send('Invalid days data: Input is not a valid JSON string or array');
    }
    // try {
    //   daysArray = JSON.parse(days);
    // } catch (error) {
    //   return res.status(400).send('Invalid days data: ' + error.message);
    // }

    // try {
    //   relatedArray = JSON.parse(related);
    // } catch (error) {
    //   return res.status(400).send('Invalid related data: ' + error.message);
    // }

    try {
      batchArray = JSON.parse(batch);
    } catch (error) {
      // Ensure this error message is for batch, not a copy-paste error
      return res.status(400).send('Invalid batch data: ' + error.message);
    }
    console.log(daysArray,batchArray);
    const included = req.body.included instanceof Array ? req.body.included : [req.body.included];
    const notincluded = req.body.notincluded instanceof Array ? req.body.notincluded : [req.body.notincluded];
    const things = req.body.things instanceof Array ? req.body.things : [req.body.things];
    const over = req.body.over instanceof Array ? req.body.over : [req.body.over];
    const relatedtreks = req.body.relatedtreks instanceof Array ? req.body.relatedtreks :  [];
    // Construct the Trek data from the request body
    const TrekData = {
      name, amount,testimagealt, fromamount, maintype, urllink, statetype, reserveamount, for1, day,
      trektype, trektypename, level, levelname, service, servicename, state, statename,
      expertpara,itinerary, expectpara, expecthead1, expecthead1para, expecthead2, expecthead2para,
      days: daysArray,
      included,
      notincluded,
      things,
      over,
      batch:batchArray,
      relatedtreks
    };
    if (TrekData.relatedtreks.length === 0) {
      TrekData.relatedtreks = undefined; // or [] if it must be an array
    }
console.log("hey",TrekData )
// daysArray.forEach((day, index) => {
//   assignImageToDay(req.files, `days[${index}].image`, day);
// });
    // Add images if they exist
    // function assignImageToField(files, fieldName, dataObject) {
    //   if (files && files[fieldName]) {
    //     // Handle single image
    //     dataObject[fieldName] = files[fieldName][0].filename;
    //   }
    // }
    // assignImageToField(req.files, 'testimage', TrekData);
    TrekData.days.forEach((day, index) => {
      if (req.files[`dayImage[${index}]`]) {
        day.image = req.files[`dayImage[${index}]`][0].key.split('/')[1]; // Extracting the filename
      }
    });
    
    // Assign image filename to 'testimage' field
    if (req.files['testimage']) {
      TrekData.testimage = req.files['testimage'][0].key.split('/')[1]; // Extracting the filename
    }
    // Assign images to day images, assuming TrekData.days is an array
    
    // TrekData.days.forEach((day, index) => {
    //   if(req.files && req.files[`dayImage[${index}]`]) {
    //     day.image = req.files[`dayImage[${index}]`][0].filename;
    //   }
    // });
    console.log("images",req.files)
    // Assign images to related images, assuming TrekData.related is an array
    // TrekData.related.forEach((relatedItem, index) => {
    //   if(req.files[`relatedImage[${index}]`]) {
    //     relatedItem.rimage = req.files[`relatedImage[${index}]`][0].filename;
    //   }
    // });

    // Create a new Trek instance and save to the database
    const newTrek = new Trek(TrekData);
    await newTrek.save();

    // Send the response back to the client
    res.json({
      message: 'Trek successfully created',
      data: newTrek
    });

  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error saving to MongoDB', error: err.message });
  }
};

// Utility function to parse array data from the request



// Utility function to assign image filenames to TrekData


// Add other utility functions as needed...

 const updateTrekById = async (req, res, next) => {

      const { id } = req.params;
      const TrekData = {};

// Conditional assignment for scalar fields
[
  'name','amount', 'fromamount', 'maintype', 'statetype',
  'reserveamount', 'for', 'day', 'trektype', 
  'trektypename', 'level', 'levelname', 'service',
  'servicename', 'state', 'statename', 'expertpara',
  'lead1name', 'lead1oc', 'lead1pimgalt', 'lead2name',
  'lead2oc', 'lead2pimgalt', 'itinerary','urllink'
].forEach(field => {
  if (req.body[field]) {
    TrekData[field] = req.body[field];
  }
});

// Conditional assignment for array fields
[
  'days', 'over', 'included', 'notincluded',
  'things', 'faq', 'related', 'batch', 'relatedtreks'
].forEach(field => {
  if (req.body[field] && req.body[field].length > 0) {
    TrekData[field] = [];
  }
});

if (req.files.testimage) {
  TrekData.testimage = req.files.testimage[0].filename;
}
if (req.files.lead1pimg) {
  TrekData.lead1pimg = req.files.lead1pimg[0].filename;
}
if (req.files.lead2pimg) {
  TrekData.lead2pimg = req.files.lead2pimg[0].filename;
}
console.log("data",req.body )
let dayIndex = 0;
while (req.body.days && req.body.days[dayIndex] && req.body.days[dayIndex].day) {
const descriptions = [];

// Iterate through descriptions for the current day, assuming description is an array
if (req.body.days[dayIndex].description) {
    descriptions.push(...req.body.days[dayIndex].description);
}

const dayData = {
    day: req.body.days[dayIndex].day,
    cityName: req.body.days[dayIndex].cityName,
    description: descriptions,
    meals: req.body.days[dayIndex].meals,
    imagealt:req.body.days[dayIndex].imagealt
};
console.log("iamge",req.body )
// if (req.files && req.files[`dayImage${dayIndex}`]) {
//     dayData.image = req.files[`dayImage${dayIndex}`][0].filename;
// }
if (req.files && req.files[`dayImage[${dayIndex}]`]) {
  dayData.image = req.files[`dayImage[${dayIndex}]`][0].filename;
}
TrekData.days.push(dayData);
dayIndex++;
}
if (req.body && req.body.over) {
let overIndex = 0;
while (req.body.over[overIndex]) {
  TrekData.over.push(req.body.over[overIndex]);
  overIndex++;
}
}
if (req.body && req.body.included) {
let includedIndex = 0
while (req.body.included[includedIndex]) {
TrekData.included.push(req.body.included[includedIndex]);
includedIndex++;
}
}
if (req.body && req.body.notincluded) {
let notincludedIndex = 0
while (req.body.notincluded[notincludedIndex]) {
TrekData.notincluded.push(req.body.notincluded[notincludedIndex]);
notincludedIndex++;
}
}
if (req.body && req.body.things) {
let thingsIndex = 0
while (req.body.things[thingsIndex]) {
TrekData.things.push(req.body.things[thingsIndex]);
thingsIndex++;
}
}
if (req.body && req.body.relatedtreks) {
  let relatedtreksIndex = 0
  while (req.body.relatedtreks[relatedtreksIndex]) {
  TrekData.relatedtreks.push(req.body.relatedtreks[relatedtreksIndex]);
  relatedtreksIndex++;
  }
  }
// Iterate through req.body.over and add elements to the 'over' array
let faqIndex = 0;
while (req.body.faq && req.body.faq[faqIndex] ) {

const faqData = {
    question: req.body.days[faqIndex].question,
    answer: req.body.days[faqIndex].answer,
};
TrekData.faq.push(faqData);
faqIndex++;
}// Ensure TrekData.related is an array before the loop.
// Initialize TrekData.related if not already

let relatedIndex = 0;
console.log("hey",req.body)
while (req.body.related && req.body.related[relatedIndex] ) {
  const relatedData = {
      rday: req.body.related[relatedIndex].rday,
      rname: req.body.related[relatedIndex].rname,
      rimagealt: req.body.related[relatedIndex].rimagealt,
      ramount: req.body.related[relatedIndex].ramount,
      rtype: req.body.related[relatedIndex].rtype,
      rtypename: req.body.related[relatedIndex].rtypename,
      rlevel: req.body.related[relatedIndex].rlevel,
      rlevelname: req.body.related[relatedIndex].rlevelname,
      rservice: req.body.related[relatedIndex].rservice,
      rservicename: req.body.related[relatedIndex].rservicename,
  };
  if (req.files && req.files[`relatedImage[${relatedIndex}]`]) {
    relatedData.rimage = req.files[`relatedImage[${relatedIndex}]`][0].filename;
  }
  TrekData.related.push(relatedData);
  relatedIndex++;
  }

console.log('Final TrekData.related:', TrekData.related);

let batchIndex = 0;
while (req.body.batch && req.body.batch[batchIndex] ) {

  const batchData = {
    date: req.body.batch[batchIndex].date,
      amount: req.body.batch[batchIndex].amount,
  };
  TrekData.batch.push(batchData);
  batchIndex++;
}
try {
      const updatedTrek = await Trek.findByIdAndUpdate(id, TrekData, { new: true });

      if (!updatedTrek) {
          return res.status(404).json({ message: 'Trek not found' });
      }

      return res.status(200).json(updatedTrek);
  } catch (error) {
      return res.status(500).json({ message: 'Server error', error: error.message });
  }
};
const getTreksGroupTour = async (req, res, next) => {
  try {
    const treks = await Trek.find({ maintype: "grouptour" });
    if (treks.length === 0) {
      return res.status(404).json({ error: 'Group Tour not found' });
    }
    res.json(treks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
const getGroupTourSort = async (req, res, next) => {
  const { sort } = req.query; // Assuming the sort criterion is passed as a query parameter

  let sortOptions = {};
  let findQuery = { maintype: "grouptour" }; // Initialize findQuery with the default filter

  switch(sort) {
    case 'priceLowToHigh':
      sortOptions = { fromamount: 1 };
      break;
    case 'priceHighToLow':
      sortOptions = { fromamount: -1 };
      break;
    case 'newestFirst':
      sortOptions = { createdAt: -1 };
      break;
    case 'mostPopular':
      sortOptions = { popularityScore: -1 };
      break;
    case 'upcoming':
      // Add to findQuery for filtering, assuming Upcoming is a Boolean field
      findQuery.Upcoming = true;
      break;
    case 'recommended':
      // Add to findQuery for filtering, assuming recommendation is a Boolean field
      findQuery.recommendation = true;
      break;
  }

  try {
    const tours = await Trek.find(findQuery).sort(sortOptions); // Apply both findQuery and sortOptions
    res.json(tours);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getLongTourSort = async (req, res, next) => {
  const { sort } = req.query; // Assuming the sort criterion is passed as a query parameter

  let sortOptions = {};
  let findQuery = { maintype: "longtour" }; // Initialize findQuery with the default filter

  switch(sort) {
    case 'priceLowToHigh':
      sortOptions = { fromamount: 1 };
      break;
    case 'priceHighToLow':
      sortOptions = { fromamount: -1 };
      break;
    case 'newestFirst':
      sortOptions = { createdAt: -1 };
      break;
    case 'mostPopular':
      sortOptions = { popularityScore: -1 };
      break;
    case 'upcoming':
      // Add to findQuery for filtering, assuming Upcoming is a Boolean field
      findQuery.Upcoming = true;
      break;
    case 'recommended':
      // Add to findQuery for filtering, assuming recommendation is a Boolean field
      findQuery.recommendation = true;
      break;
  }

  try {
    const tours = await Trek.find(findQuery).sort(sortOptions); // Apply both findQuery and sortOptions
    res.json(tours);
  } catch (error) {
    res.status(500).send(error);
  }
};
 const getTreksLongTour = async (req, res, next) => {
  try {
    const trekslong = await Trek.find({ maintype: "longtour" });
    if (trekslong.length === 0) {
      return res.status(404).json({ error: 'Long Tour not found' });
    }
    res.json(trekslong);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// International
 const getTreksInternational = async (req, res, next) => {
  try {
    const treks = await Trek.find({ maintype: 'international' });
    if (treks.length === 0) {
      return res.status(404).json({ error: 'International Tour not found' });
    }
    res.json(treks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// North India Tour
 const getTreksNorthIndiaTour = async (req, res, next) => {
  try {
    const treks = await Trek.find({ maintype: 'northindiatour' });
    if (treks.length === 0) {
      return res.status(404).json({ error: 'North India Tour not found' });
    }
    res.json(treks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
 const getTreksSpecialTour = async (req, res, next) => {
  try {
    const treks = await Trek.find({ maintype: 'specialtour' });
    if (treks.length === 0) {
      return res.status(404).json({ error: 'Special Tour not found' });
    }
    res.json(treks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
const getTreksSpecialTrek = async (req, res, next) => {
  try {
    const treks = await Trek.find({ maintype: 'specialtrek' });
    if (treks.length === 0) {
      return res.status(404).json({ error: 'Special Trek not found' });
    }
    res.json(treks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
// North India Trek
 const getTreksNorthIndiaTrek = async (req, res, next) => {
  try {
    const treks = await Trek.find({ maintype: 'northindiatrek' });
    if (treks.length === 0) {
      return res.status(404).json({ error: 'North India Trek not found' });
    }
    res.json(treks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Karnataka Trek
 const getTreksKarnatakaTrek = async (req, res, next) => {
  try {
    const treks = await Trek.find({ maintype: 'karnatakatrek' });
    if (treks.length === 0) {
      return res.status(404).json({ error: 'Karnataka Trek not found' });
    }
    res.json(treks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Kerala Trek
 const getTreksKeralaTrek = async (req, res, next) => {
  try {
    const treks = await Trek.find({ maintype: 'keralatrek' });
    if (treks.length === 0) {
      return res.status(404).json({ error: 'Kerala Trek not found' });
    }
    res.json(treks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Tamil Nadu Trek
const getTreksTNTrek = async (req, res, next) => {
  try {
    const treks = await Trek.find({ maintype: 'tntrek' });
    if (treks.length === 0) {
      return res.status(404).json({ error: 'Tamil Nadu Trek not found' });
    }
    res.json(treks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
const getEventCounts = async (req, res) => {
  try {
    const totalTours = await Trek.countDocuments({ maintype: { $in: tourTypes } });
    const totalTreks = await Trek.countDocuments({ maintype: { $in: trekTypes } });

    const totalEvents = totalTours + totalTreks;

    res.status(200).json({ totalEvents });
  } catch (error) {
    res.status(500).json({ error: "Could not retrieve total events count" });
  }
};

module.exports = {
    getTrek,
    getTour,
    getTourfull,
    getTrekfull,
    getTreksall,
    getTourByName,
    getTrekByName,
    getTrekById,
    getTreksMain,
    createTrek,
    updateTrekById,
    getTreksGroupTour,
    getTreksLongTour,
    getTreksInternational,
    getTreksSpecialTour,
    getTreksNorthIndiaTour,
    getTreksKarnatakaTrek,
    getTreksNorthIndiaTrek,
    getTreksKeralaTrek,
    getTreksTNTrek,
    getTreksSpecialTrek,
    getEventCounts,
    getGroupTourSort,
    getLongTourSort
}