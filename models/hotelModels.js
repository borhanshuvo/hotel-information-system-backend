// external imports
const mongoose = require("mongoose");
const hotelSchema = mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
    },

    address: {
      type: String,
      default: "",
    },

    overview: {
      type: String,
      default: "",
    },

    policy: {
      type: String,
      default: "",
    },

    checkIn: {
      type: String,
      default: "",
    },

    checkOut: {
      type: String,
      default: "",
    },

    locationId: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      default: 0,
    },

    discount: {
      type: Number,
      default: 0,
    },

    thumbnailImageURL: {
      type: String,
      default: "",
    },

    activate: {
      type: Boolean,
      default: false,
    },

    rating: {
      type: Number,
      default: 5,
    },

    user: {
      type: Object,
    },
  },

  {
    timestamps: true,
  }
);

const Hotel = mongoose.model("Hotel", hotelSchema);
module.exports = Hotel;
