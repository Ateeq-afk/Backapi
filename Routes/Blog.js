const express = require('express');
const { upload } = require('../Middleware/uploadaws.js');
const { createBlog, getBlogByName, getBlogssall } = require('../Controllers/blog.js');


const router = express.Router();

router.post('/createblog', upload.fields([...Array.from({ length: 30 }, (_, i) => ({ name: `blogImage[${i}]` }))]), createBlog);
// router.post('/createblog', upload.single('file'), createBlog);
router.get('/:name', getBlogByName);
router.get('/', getBlogssall);

module.exports = router;