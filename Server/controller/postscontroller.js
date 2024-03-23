const getAllPostController = async (req, res) => {
    const userId = req.userId; // Corrected to access userId instead of req.user._id
    console.log(userId);
    return res.status(200).send("These are all the posts");
};

module.exports = { getAllPostController };
