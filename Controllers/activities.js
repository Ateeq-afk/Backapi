const Activity = require("../Model/Activities.js");

const createActivity = async (req, res) => {
    try {
      // Extract the activity information from the request body
      const {
        name, coverimage, coverimage2, coverimage3, coverimage4, coverimage5, coverimage6,
        coverimagealt,coverimagealt2,coverimagealt3,coverimagealt4,coverimagealt5,coverimagealt6,
        urllink, metatitle, metades, destination,amount, fromamount, booking, desc,
        days, over, confirmation, cancellation, faq, similar, blogs, related, highlight,type
      } = req.body;
      console.log(req.body);
      console.log(req.files);
      
      let daysArray, faqArray,bookingArray;
      console.log(req.body.blogs);
      // Parsing days from JSON if applicable
      if (typeof days === 'string') {
        try {
          daysArray = JSON.parse(days);
        } catch (error) {
          return res.status(400).send('Invalid days data: ' + error.message);
        }
      } else if (days instanceof Array) {
        daysArray = days;
      } else {
        return res.status(400).send('Invalid days data');
      }
      if (typeof booking === 'string') {
        try {
          bookingArray = JSON.parse(booking);
        } catch (error) {
          return res.status(400).send('Invalid days data: ' + error.message);
        }
      } else if (booking instanceof Array) {
        bookingArray = booking;
      } else {
        return res.status(400).send('Invalid days data');
      }
      // Parsing FAQ from JSON if applicable
      try {
        faqArray = JSON.parse(faq);
      } catch (error) {
        // Ensure this error message is for batch, not a copy-paste error
        return res.status(400).send('Invalid batch data: ' + error.message);
      }
    
      // Construct the Activity data from the request body
      const activityData = {
        name, coverimage, coverimage2, coverimage3, coverimage4, coverimage5, coverimage6,
        coverimagealt,coverimagealt2,coverimagealt3,coverimagealt4,coverimagealt5,coverimagealt6,
        urllink, metatitle, metades,destination, amount, fromamount, type,
        booking: bookingArray, 
        days: daysArray,
        highlight: highlight instanceof Array ? highlight : [highlight],
        desc: desc instanceof Array ? desc : [desc],
        over: over instanceof Array ? over : [over],
        confirmation: confirmation instanceof Array ? confirmation : [confirmation],
        cancellation: cancellation instanceof Array ? cancellation : [cancellation],
        faq: faqArray,
        similar: similar instanceof Array ? similar : [similar],
        blogs: blogs instanceof Array ? blogs : [blogs],
        related: related instanceof Array ? related : [related],
      };
      activityData.days.forEach((day, index) => {
        if (req.files[`dayImage[${index}]`]) {
          day.image = req.files[`dayImage[${index}]`][0].key.split('/')[1]; // Extracting the filename
        }
      });
      if (req.files['coverimage']) {
        activityData.coverimage = req.files['coverimage'][0].key.split('/')[1]; // Extracting the filename
      }
      if (req.files['coverimage2']) {
        activityData.coverimage2 = req.files['coverimage2'][0].key.split('/')[1]; // Extracting the filename
      }
      if (req.files['coverimage3']) {
        activityData.coverimage3 = req.files['coverimage3'][0].key.split('/')[1]; // Extracting the filename
      }
      if (req.files['coverimage4']) {
        activityData.coverimage4 = req.files['coverimage4'][0].key.split('/')[1]; // Extracting the filename
      }
      if (req.files['coverimage5']) {
        activityData.coverimage5 = req.files['coverimage5'][0].key.split('/')[1]; // Extracting the filename
      }
      if (req.files['coverimage6']) {
        activityData.coverimage6 = req.files['coverimage6'][0].key.split('/')[1]; // Extracting the filename
      }
      // Create a new Activity instance and save to the database
      console.log(req.body);
console.log(req.files);

      const newActivity = new Activity(activityData);
      await newActivity.save();
  
      // Send the response back to the client
      res.json({
        message: 'Activity successfully created',
        data: newActivity
      });
  
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: 'Error creating activity', error: err.message });
    }
  };
  const createStays = async (req, res) => {
    try {
      // Extract the activity information from the request body
      const {
        name, coverimage, coverimage2, coverimage3, coverimage4, coverimage5, coverimage6,
        coverimagealt,coverimagealt2,coverimagealt3,coverimagealt4,coverimagealt5,coverimagealt6,
        urllink, metatitle, metades, destination,amount, fromamount, booking, desc,
     over, confirmation, cancellation, faq, similar, blogs, related, highlight,type
      } = req.body;
    //   console.log(req.body);
    //   console.log(req.files);
      
    //   let daysArray, faqArray,bookingArray;
    //   console.log(req.body.blogs);
      // Parsing days from JSON if applicable

      if (typeof booking === 'string') {
        try {
          bookingArray = JSON.parse(booking);
        } catch (error) {
          return res.status(400).send('Invalid days data: ' + error.message);
        }
      } else if (booking instanceof Array) {
        bookingArray = booking;
      } else {
        return res.status(400).send('Invalid days data');
      }
      // Parsing FAQ from JSON if applicable
      try {
        faqArray = JSON.parse(faq);
      } catch (error) {
        // Ensure this error message is for batch, not a copy-paste error
        return res.status(400).send('Invalid batch data: ' + error.message);
      }
    
      // Construct the Activity data from the request body
      const activityData = {
        name, coverimage, coverimage2, coverimage3, coverimage4, coverimage5, coverimage6,
        coverimagealt,coverimagealt2,coverimagealt3,coverimagealt4,coverimagealt5,coverimagealt6,
        urllink, metatitle, metades,destination, amount, fromamount, type,
        booking: bookingArray, 
        highlight: highlight instanceof Array ? highlight : [highlight],
        desc: desc instanceof Array ? desc : [desc],
        over: over instanceof Array ? over : [over],
        confirmation: confirmation instanceof Array ? confirmation : [confirmation],
        cancellation: cancellation instanceof Array ? cancellation : [cancellation],
        faq: faqArray,
        similar: similar instanceof Array ? similar : [similar],
        blogs: blogs instanceof Array ? blogs : [blogs],
        related: related instanceof Array ? related : [related],
      };
      if (req.files['coverimage']) {
        activityData.coverimage = req.files['coverimage'][0].key.split('/')[1]; // Extracting the filename
      }
      if (req.files['coverimage2']) {
        activityData.coverimage2 = req.files['coverimage2'][0].key.split('/')[1]; // Extracting the filename
      }
      if (req.files['coverimage3']) {
        activityData.coverimage3 = req.files['coverimage3'][0].key.split('/')[1]; // Extracting the filename
      }
      if (req.files['coverimage4']) {
        activityData.coverimage4 = req.files['coverimage4'][0].key.split('/')[1]; // Extracting the filename
      }
      if (req.files['coverimage5']) {
        activityData.coverimage5 = req.files['coverimage5'][0].key.split('/')[1]; // Extracting the filename
      }
      if (req.files['coverimage6']) {
        activityData.coverimage6 = req.files['coverimage6'][0].key.split('/')[1]; // Extracting the filename
      }
      // Create a new Activity instance and save to the database
      console.log(req.body);
console.log(req.files);

      const newActivity = new Activity(activityData);
      await newActivity.save();
  
      // Send the response back to the client
      res.json({
        message: 'Activity successfully created',
        data: newActivity
      });
  
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: 'Error creating activity', error: err.message });
    }
  };
  const getActivitysall = async (req,res,next)=>{
    try {
      const activity = await Activity.find();
      // res.status(200).json(treks);
      res.status(200).json({ success: true, data: activity });
    } catch (err) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
  module.exports = {
    createActivity,
    createStays,
    getActivitysall
  }