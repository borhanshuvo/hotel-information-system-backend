const express = require("express");
const { addReview, getReviews } = require("../controllers/reviewControllers");
const { checkLogin } = require("../middlewares/checkLogin");
const router = express.Router();

// get review
router.get("/get-review", getReviews);

// add review
router.post("/add-review", checkLogin, addReview);

module.exports = router;
