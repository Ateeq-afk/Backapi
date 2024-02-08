const TourDate = require("../Model/Dates.js");
// Adjust this function according to your route setup
const getTourByDate = async (req, res) => {
    try {
      const dateParam = req.params.date; // 'YYYY-MM-DD' from the frontend
      // No need to convert to a Date object since you're storing dates as strings
      const tourDate = await TourDate.findOne({ date: dateParam }).populate("tourId");
      if (!tourDate) {
        return res.status(404).json({ error: "Tour not found for this date" });
      }
      res.status(200).json(tourDate.tourId); // Send the tours associated with the date
    } catch (error) {
      res.status(500).json({ error: "Could not retrieve tour" });
    }
  };
  const getTrekByDate = async (req, res) => {
    try {
      const dateParam = req.params.date; // 'YYYY-MM-DD' from the frontend
      // No need to convert to a Date object since you're storing dates as strings
      const tourDate = await TourDate.findOne({ date: dateParam }).populate("trekId");
      if (!tourDate) {
        return res.status(404).json({ error: "Tour not found for this date" });
      }
      res.status(200).json(tourDate.trekId); // Send the tours associated with the date
    } catch (error) {
      res.status(500).json({ error: "Could not retrieve tour" });
    }
  };
  
  const ToursByDate = async (req, res) => {
  try {
    const tourDates = await TourDate.find();
    res.status(200).json(tourDates);
  } catch (error) {
    res.status(500).json({ error: "Could not retrieve tour dates" });
  }
}

module.exports = { getTourByDate, ToursByDate, getTrekByDate };