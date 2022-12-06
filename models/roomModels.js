// external imports
const mongoose = require("mongoose");
const roomSchema = mongoose.Schema(
  {
    hotels: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel" },

    hotelEmail: {
      type: String,
    },

    name: {
      type: String,
      require: true,
      trim: true,
    },

    roomAmenities: {
      type: String,
      default: "",
    },

    adult: {
      type: Number,
      default: 0,
    },

    child: {
      type: Number,
      default: 0,
    },

    numberOfBed: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      require: true,
      default: 0,
    },

    bedPrice: {
      type: Number,
      default: 0,
    },

    discount: {
      type: Number,
      default: 0,
    },

    roomImageURL: {
      type: String,
      default: "",
    },

    available: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
  }
);

const Room = mongoose.model("Room", roomSchema);
module.exports = Room;
