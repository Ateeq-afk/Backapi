const Attraction = require('../Model/Attraction'); // Adjust the path as necessary

const createAttraction = async (req, res) => {
    try {
        // Extract the attraction information from the request body
        const {
            name, coverimage, coverimagealt, type, urllink, metatitle, metades, destination, 
            over, content, faq, AttractionType, reach, label, timings, timeRequired, entryFee,
            attraction,mustattraction,activity,bloga
        } = req.body;

        // Handle content and faq parsing similarly to how days and faq were handled in createActivity
        let contentArray, faqArray;
        
        // Parsing content from JSON if applicable
        if (typeof content === 'string') {
            try {
                contentArray = JSON.parse(content);
            } catch (error) {
                return res.status(400).send('Invalid content data: ' + error.message);
            }
        } else if (content instanceof Array) {
            contentArray = content;
        } else {
            return res.status(400).send('Invalid content data');
        }

        // Parsing FAQ from JSON if applicable
        if (typeof faq === 'string') {
            try {
                faqArray = JSON.parse(faq);
            } catch (error) {
                return res.status(400).send('Invalid faq data: ' + error.message);
            }
        } else if (faq instanceof Array) {
            faqArray = faq;
        } else {
            return res.status(400).send('Invalid faq data');
        }

        // Construct the Attraction data from the request body
        const attractionData = {
            name, coverimage, coverimagealt, type, urllink, metatitle, metades, destination, 
            over: over instanceof Array ? over : [over],
            content: contentArray,
            faq: faqArray,
            AttractionType, reach, label, timings, timeRequired, entryFee,
            attraction:attraction instanceof Array ? attraction : [attraction],
            mustattraction: mustattraction instanceof Array ? mustattraction : [mustattraction],
            activity: activity instanceof Array ? activity : [activity],
            bloga: bloga instanceof Array ? bloga : [bloga]
        };
        attractionData.content.forEach((content, index) => {
            if (req.files[`contentImage[${index}]`]) {
                content.image = req.files[`contentImage[${index}]`][0].key.split('/')[1]; // Extracting the filename
            }
          });
        // If using file uploads for coverimage, handle them similar to how coverimage is handled in createActivity
        if (req.files && req.files['coverimage']) {
            attractionData.coverimage = req.files['coverimage'][0].key.split('/')[1]; // Extracting the filename
        }

        // Create a new Attraction instance and save to the database
        const newAttraction = new Attraction(attractionData);
        await newAttraction.save();

        // Send the response back to the client
        res.json({
            message: 'Attraction successfully created',
            data: newAttraction
        });

    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Error creating attraction', error: err.message });
    }
};
const getAttractionsAll = async (req, res, next) => {
    try {
        const attractions = await Attraction.find();
        res.status(200).json({ success: true, data: attractions });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
module.exports = {
    getAttractionsAll,
    createAttraction
  }
