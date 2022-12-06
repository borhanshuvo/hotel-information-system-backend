// external imports
const mongoose = require("mongoose");
const reviewSchema = mongoose.Schema(
  {
    users: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    review: {
      type: String,
      default: "",
    },
  },

  {
    timestamps: true,
  }
);

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
