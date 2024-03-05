const Blog = require("../Model/Blog.js");
// const createBlog = async (req, res, next) => {
//   try {
//       const { name, urllink, metatitle, metades, over, products } = req.body;

//       let blogsArray;
//       try {
//           blogsArray = JSON.parse(req.body.blogs);
//       } catch (error) {
//           return res.status(400).send('Invalid blogs data: ' + error.message);
//       }

//       // Adding image URL from the uploaded file
//       if (req.file) {
//           blogsArray.forEach(blog => {
//               blog.image = req.file.location; // Assuming you want the same image for all blogs
//           });
//       }

//       const BlogData = {
//           name,
//           urllink,
//           products: products instanceof Array ? products : [products],
//           metatitle,
//           metades,
//           over: over instanceof Array ? over : [over],
//           blogs: blogsArray
//       };

//       const newBlog = new Blog(BlogData);
//       await newBlog.save();
//       console.log('BlogData:', BlogData);
//       res.json({
//           message: 'Blog created successfully',
//           data: newBlog
//       });
//   } catch (err) {
//       console.error(err);
//       res.status(500).send('Error creating blog:', err.message);
//   }
// };

const createBloga = async (req, res, next) => {
  try {
  const {
    name,
    urllink,
    blogs,
    metatitle,
    metades,
    coverimagealt,
    type,
    time,
    date,
    photoname,
    destination,
    blog
  } = req.body;
  
  const over = req.body.over instanceof Array ? req.body.over : [req.body.over];
  const products = req.body.products instanceof Array ? req.body.products : [req.body.products];
  const tourproducts = req.body.tourproducts instanceof Array ? req.body.tourproducts : [req.body.tourproducts];
  const bloga = req.body.bloga instanceof Array ? req.body.bloga : [req.body.bloga];
    let blogsArray
    try {
      blogsArray = JSON.parse(blogs);
    } catch (error) {
      return res.status(400).send('Invalid days data: ' + error.message);
    }
    if (req.files['coverimage']) {
      activityData.coverimage = req.files['coverimage'][0].key.split('/')[1]; // Extracting the filename
    }
    if (req.files['photo']) {
      activityData.photo = req.files['photo'][0].key.split('/')[1]; // Extracting the filename
    }
    BlogData.blog.forEach((blog, index) => {
      if(req.files && req.files[`blogImage[${index}]`]) {
          blog.image = req.files[`blogImage[${index}]`][0].key.split('/')[1];
      }
    });
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
      products,
      tourproducts,
      metatitle,
      metades,
      over,
      bloga,
      type,
      time,
      date,
      photoname,
      destination,
      coverimagealt,
      blog: blogsArray
    };

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
const createBlog = async (req, res, next) => {
    try {
    const {
      name,
      urllink,
      blogs,
      metatitle,
      metades
    } = req.body;
    
    const over = req.body.over instanceof Array ? req.body.over : [req.body.over];
    const products = req.body.products instanceof Array ? req.body.products : [req.body.products];

   
      let blogsArray
      try {
        blogsArray = JSON.parse(blogs);
      } catch (error) {
        return res.status(400).send('Invalid days data: ' + error.message);
      }
      const BlogData = {
        name,
        urllink,
        products,
        metatitle,
        metades,
        over,
        blogs: blogsArray
      };
      BlogData.blogs.forEach((blog, index) => {
        if(req.files && req.files[`blogImage[${index}]`]) {
            blog.image = req.files[`blogImage[${index}]`][0].key.split('/')[1];
        }
      });
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
    module.exports = {
        createBlog,
        getBlogByName,
        getBlogssall,
        createBloga,
    };