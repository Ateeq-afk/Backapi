const Blog = require("../Model/Blog.js");
const createBlog = async (req, res, next) => {
    try {
    const {
      name,
      urllink,
      blogs
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
        over,
        blogs: blogsArray
      };
      BlogData.blogs.forEach((blog, index) => {
        if(req.files && req.files[`blogImage[${index}]`]) {
            blog.image = req.files[`blogImage[${index}]`][0].filename;
        }
      });
        const newBlog = new Blog(BlogData);
        await newBlog.save();
    
        res.json({
          message: 'Destination created successfully',
          data: newBlog,
        });
      } catch (err) {
        console.error(err);
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
        getBlogssall
    };