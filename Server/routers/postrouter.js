const router = require('express').Router();
const postController = require('../controller/postscontroller');
const requireuser = require('../middleware/requireuser')

// Define route handler
router.get('/all', requireuser, postController.getAllPostController);


module.exports = router;
