const Dest = require("../Model/Dest.js");

const createDest = async (req, res, next) => {
  try {
  const {
    name,
    imgagealt,
    urllink,
    maintype
  } = req.body;
  
  const over = req.body.over instanceof Array ? req.body.over : [req.body.over];
  const products = req.body.products instanceof Array ? req.body.products : [req.body.products];
  const blogs = req.body.blogs instanceof Array ? req.body.blogs : [req.body.blogs];
    const DestData = {
      name,
      maintype,
      urllink,
      imgagealt,
      products,
      over,
      blogs
    };

  // const blog = req.body.blog instanceof Array ? req.body.blog : [req.body.blog];
  function assignImageToField(files, fieldName, dataObject) {
    if (files && files[fieldName]) {
      // Handle single image
      dataObject[fieldName] = files[fieldName][0].filename;
    }
  }
  assignImageToField(req.files, 'coverimage', DestData);

      const newDest = new Dest(DestData);
      await newDest.save();
  
      res.json({
        message: 'Destination created successfully',
        data: newDest,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error creating destination:', err.message);
    }
  };
  const createDesta = async (req, res, next) => {
    try {
    const {
      name,
      imgagealt,
      urllink,
      maintype
    } = req.body;
    
    const products = req.body.products instanceof Array ? req.body.products : [req.body.products];
    const blogs = req.body.blogs instanceof Array ? req.body.blogs : [req.body.blogs];
      const DestData = {
        name,
        maintype,
        urllink,
        imgagealt,
        products,
        over,
        blogs
      };
  
    // const blog = req.body.blog instanceof Array ? req.body.blog : [req.body.blog];
    function assignImageToField(files, fieldName, dataObject) {
      if (files && files[fieldName]) {
        // Handle single image
        dataObject[fieldName] = files[fieldName][0].filename;
      }
    }
    assignImageToField(req.files, 'coverimage', DestData);
  
        const newDest = new Dest(DestData);
        await newDest.save();
    
        res.json({
          message: 'Destination created successfully',
          data: newDest,
        });
      } catch (err) {
        console.error(err);
        res.status(500).send('Error creating destination:', err.message);
      }
    };
    
  
  // Delete a destination by name
const deleteDest= async (req,res,next)=>{
    try {
      const { id } = req.params;
      const deletedDest = await Dest.findByIdAndDelete(id);
      if (!deletedDest) {
        return res.status(404).json({ error: "Destination not found" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: "Could not delete destination" });
    }
  }
const getDestsall = async (req,res,next)=>{
    try {
      const dests = await Dest.find();
      // res.status(200).json(treks);
      res.status(200).json({ success: true, data: dests });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
const getDestMain = async (req, res, next) => {
    try {
      let dests = await Dest.find(
        {},
        {  name: 1 } // Projection: include id and name, exclude _id
      );
  
      let { q } = req.query;
  
      if (q) {
        dests = dests.filter(x => x.name.toLowerCase().includes(q));
      }
  
      res.status(200).json(dests);
    } catch (err) {
      next(err);
    }
  };
  // Update a destination by name
const updateDestById = async (req, res, next) => {
    // const { name } = req.params;
    const { id } = req.params;
    const DestData = {};
  
    // Conditional assignment for scalar fields
    [
      'name', 'maintype','urllink'
    ].forEach(field => {
      if (req.body[field]) {
        DestData[field] = req.body[field];
      }
    });
  
    // Conditional assignment for array fields
    ['over', 'products','blogs'].forEach(field => {
        if (req.body[field] && req.body[field].length > 0) {
          DestData[field] = [];
        }
      });
      if (req.files.coverimage) {
        DestData.coverimage = req.files.coverimage[0].filename;
      }
    // Iterate through req.body.over and add elements to the 'over' array
    let overIndex = 0;
    while (req.body.over && req.body.over[overIndex]) {
      DestData.over.push(req.body.over[overIndex]);
      overIndex++;
    }
    let productsIndex = 0;
    while (req.body.products && req.body.products[productsIndex]) {
      DestData.products.push(req.body.products[productsIndex]);
      productsIndex++;
      }
      let blogsIndex = 0;
      while (req.body.blogs && req.body.blogs[blogsIndex]) {
        DestData.blogs.push(req.body.blogs[blogsIndex]);
        blogsIndex++;
        }
      // if (req.body.blogs && req.body.blogs.length > 0) {
      //   DestData.blogs = req.body.blogs; 
      // }
    try {
      const updatedDest = await Dest.findByIdAndUpdate(id, DestData, { new: true });
  
      if (!updatedDest) {
        return res.status(404).json({ message: 'Destination not found' });
      }
  
      return res.status(200).json(updatedDest);
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
  
  // Get a destination by name
  const getDestByName= async (req,res,next)=>{
    try {
      // const name = req.params.name;
      const linkName = req.params.name;
      const dest = await Dest.findOne({urllink: linkName}).populate('products').populate('blogs');
      if (!dest) {
        return res.status(404).json({ error: "Destination not found" });
      }
      res.status(200).json(dest);
    } catch (error) {
      res.status(500).json({ error: "Could not retrieve destination" });
    }
  }
  
  // destinationController.js

// Function to find destinations by main type: south India
const getDestinationsSouthIndia = async (req, res, next) => {
  try {
    const destinations = await Dest.find({ maintype: 'southindia' }).sort({ order: 1 });
    console.log('Destinations:', destinations);
    if (destinations.length === 0) {
      return res.status(404).json({ error: 'South Destination not found' });
    }
    res.json(destinations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
// Function to find destinations by main type: north India
const getDestinationsNorthIndia = async (req, res, next) => {
  try {
    const destinations = await Dest.find({ maintype: 'northindia' }).sort({ order: 1 });
    if (!destinations) {
      return res.status(404).json({ error: 'North Destination not found' });
    }
    res.json(destinations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Function to find destinations by main type: international
const getDestinationsInternational = async (req, res, next) => {
  try {
    const destinations = await Dest.find({ maintype: 'international' }).sort({ order: 1 });
    if (!destinations) {
      return res.status(404).json({ error: 'International Destination not found' });
    }
    res.json(destinations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createDest,
  deleteDest,
  getDestsall,
  getDestMain,
  updateDestById,
  getDestByName,
  getDestinationsSouthIndia,
  getDestinationsNorthIndia,
  getDestinationsInternational
};