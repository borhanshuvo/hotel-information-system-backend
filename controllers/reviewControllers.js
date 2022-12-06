const Review = require("../models/reviewModels");

// get review
async function getReviews(req, res, next) {
  try {
    const reviews = await Review.find()
      .populate("users", "-password")
      .sort({ updatedAt: -1 });
    res.status(200).json({
      reviews: reviews,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error!",
      success: false,
    });
  }
}

// add review
async function addReview(req, res) {
  try {
    const review = new Review(req.body);
    const result = review.save();

    if (result) {
      res.status(200).json({
        message: "Review added successfully!",
        success: true,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error!",
      success: false,
    });
  }
}

module.exports = {
  getReviews,
  addReview,
};
