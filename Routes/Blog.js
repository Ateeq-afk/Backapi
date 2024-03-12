const express = require('express');
const { upload } = require('../Middleware/uploadaws.js');
const { createBlog, getBlogByName, getBlogssall,createBloga,getall } = require('../Controllers/blog.js');


const router = express.Router();

// router.post('/createblog', upload.fields([...Array.from({ length: 30 }, (_, i) => ({ name: `blogImage[${i}]` }))]), createBlog);
router.get('/all', getall);
router.post("/createblogs",createBloga );
// router.post("/createblogs", upload.fields([
//     { name: 'coverimage' },
//     { name: 'photo' },
//     ...Array.from({ length: 100 }, (_, i) => ({ name: `blogImage[${i}]` }))
// ]),createBloga );
// router.post('/createblog', upload.single('file'), createBlog);
router.get('/:name', getBlogByName);
router.get('/', getBlogssall);


module.exports = router;