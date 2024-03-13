const Blog = require("../Model/Blog.js");
const Activity = require("../Model/Activities.js");


const createBloga = async (req, res, next) => {
  try {
  const {
    name,
    urllink,
    title,
    metatitle,
    metades,
    coverimagealt,
    type,
    time,
    date,
    photoname,
    destination,
    blog,
    coverimage,
    photo,
  } = req.body;
 
  const over = req.body.over instanceof Array ? req.body.over : [req.body.over];
  const products = req.body.products instanceof Array ? req.body.products : [req.body.products];
  const tourproducts = req.body.tourproducts instanceof Array ? req.body.tourproducts : [req.body.tourproducts];
  const bloga = req.body.bloga instanceof Array ? req.body.bloga : [req.body.bloga];
  const blogproduct = req.body.blogproduct instanceof Array ? req.body.blogproduct : [req.body.blogproduct];
  const activityproduct = req.body.activityproduct instanceof Array ? req.body.activityproduct : [req.body.activityproduct];
    let blogArray
 
    console.log(req.body,"reqbody");

    if (typeof blog === 'string') {
      try {
        blogArray = JSON.parse(blog);
      } catch (error) {
        return res.status(400).send('Invalid days data: ' + error.message);
      }
    } else if (blog instanceof Array) {
      blogArray = blog;
    } else {
      return res.status(400).send('Invalid days data');
    }
    const BlogData = {
      name,
      urllink,
      title,
      products,
      tourproducts,
      metatitle,
      metades,
      over,
      bloga,
      blogproduct,
      activityproduct,
      type,
      time,
      date,
      photoname,
      destination,
      coverimagealt,
      coverimage,
      photo,
      blog: blogArray
    };
    console.log('BlogData before saving:', BlogData);
    // if (req.files['coverimage']) {
    //   BlogData.coverimage = req.files['coverimage'][0].key.split('/')[1]; // Extracting the filename
    // }
    // if (req.files['photo']) {
    //   BlogData.photo = req.files['photo'][0].key.split('/')[1]; // Extracting the filename
    // }
    // BlogData.blog.forEach((blog, index) => {
    //   if(req.files && req.files[`blogImage[${index}]`]) {
    //       blog.image = req.files[`blogImage[${index}]`][0].key.split('/')[1];
    //   }
    // });
      const newBlog = new Blog(BlogData);
      await newBlog.save();
      console.log('BlogData:', BlogData);
      res.json({
        message: 'Destination created successfully',
        data: newBlog,
      });
    } catch (err) {
      console.error(err);
      console.log(err,"hey")
      res.status(500).send('Error creating destination:', err.message);
    }
  };

    const getBlogByName = async (req, res) => {
      try {
        const linkName = req.params.name;
        const blog = await Blog.findOne({  urllink: linkName }).populate('products');
        if (!blog) {
          return res.status(404).json({ error: "Blog not found" });
        }
        res.status(200).json(blog);
      } catch (error) {
        res.status(500).json({ error: "Could not retrieve blog" });
      }
    };

     const getBlogssall = async (req,res,next)=>{
      try {
        const blogs = await Blog.find();
        // res.status(200).json(treks);
        res.status(200).json({ success: true, data: blogs });
      } catch (err) {
        res.status(500).json({ success: false, error: error.message });
      }
    }
    const getall = async (req, res, next) => {
      try {
        // Fetch all blogs
        const blogs = await Blog.find();
    
        // Fetch all activities
        const activities = await Activity.find();
    
        // Combine blogs and activities
        const combinedData = {
          blogs: blogs,
          activities: activities
        };
    
        res.status(200).json({ success: true, data: combinedData });
      } catch (err) {
        res.status(500).json({ success: false, error: err.message });
      }
    };
    
    module.exports = {
        getBlogByName,
        getBlogssall,
        createBloga,
        getall
    };