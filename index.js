const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const TrekRoute = require("./Routes/Trek.js");
const UserRoute = require("./Routes/User.js");
const BookbRoute = require("./Routes/Booka.js");
const DestRoute = require("./Routes/Dest.js");
const MemberaRoute = require("./Routes/Membera.js");
const BlogRoute = require("./Routes/Blog.js");
const EnqRoute = require("./Routes/Enquiry.js");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require('axios')


const app = express();
dotenv.config();

// const connect = async () => {
//     try {
//         await mongoose.connect(process.env.MONGODB_URI);
//         console.log("Connected to Mongodb")
//     }catch(error){
//         throw error;
//     }
// };

const connect = async () => {
    const dbURI = "mongodb+srv://ateeq:A53Eo-1996@cluster0.pdwyorg.mongodb.net/Backpack?retryWrites=true&w=majority";
    try {
        await mongoose.connect(dbURI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Connection to MongoDB failed", error);
        throw error;
    }
};

connect();

app.use(cors())
// app.use(cookieParser())
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());

app.use("/uploads", (req, res, next) => {
    console.log('Request for static file received:', req.path);
    next();
}, express.static('uploads'));

app.use("/trek", TrekRoute);
app.use("/auth",UserRoute)
app.use("/bookb",BookbRoute);
app.use("/dest", DestRoute);
app.use("/membera", MemberaRoute);
app.use("/blog", BlogRoute);
app.use("/enquiry", EnqRoute);

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong!";
    return res.status(status).json({
      success: false,
      status,
      message,
    });
  });

  const port = process.env.PORT || 4000; 
  app.listen(port, ()=>{
      connect();
      console.log(`Connected to backend at port ${port}`)
  });

  app.get('/', (req, res) => {
    res.send('Hey this is my API running 🥳')
  })
  app.get('/fetch-reviews', async (req, res) => {
    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
            params: {
                placeid: 'ChIJq4TTOeYVrjsRpIFDsBNjFqQ',
                key: process.env.GOOGLE_KEY,
                fields: 'reviews'
            }
        });
        res.send(response.data);
    } catch (error) {
        console.log(error)
        res.status(500).send('Error fetching reviews');
    }
});