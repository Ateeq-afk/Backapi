const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const TrekRoute = require("./Routes/Trek.js");
const UserRoute = require("./Routes/User.js");
const BookRoute = require("./Routes/Book.js");
const DestRoute = require("./Routes/Dest.js");
const MemberRoute = require("./Routes/Member.js");
const BlogRoute = require("./Routes/Blog.js");
const EnqRoute = require("./Routes/Enquiry.js");
const bodyParser = require("body-parser");
const cors = require("cors");



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
app.use("/api/v1",BookRoute );
app.use("/dest", DestRoute);
app.use("/member", MemberRoute);
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