const router = require('express').Router();
const postController = require('../controller/postscontroller');

// Define route handler
router.get('/all', postController.getAllPostController);


module.exports = router;
