const { success } = require("../utils/responseWrapper");

const getAllPostController = async (req, res) => {
    const userId = req._id; // Corrected to access userId instead of req.user._id
    console.log(userId);
    return res.send(success(200, "These are all the posts"));
};

module.exports = { getAllPostController };
