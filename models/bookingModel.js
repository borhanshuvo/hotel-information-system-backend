// external imports
const mongoose = require("mongoose");
const bookingSchema = mongoose.Schema(
  {
    customerName: {
      type: String,
      default: "",
    },

    customerEmail: {
      type: String,
      default: "",
    },

    customerPhoneNumber: {
      type: String,
      default: "",
    },

    hotels: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel" },

    rooms: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },

    roomPrice: {
      type: Number,
      default: 0,
    },

    numberOfBed: {
      type: Number,
      default: 0,
    },

    bedPrice: {
      type: Number,
      default: 0,
    },

    adult: {
      type: Number,
      default: 0,
    },

    child: {
      type: Number,
      default: 0,
    },

    totalDays: {
      type: Number,
      default: 0,
    },

    from: {
      type: String,
      default: "",
    },

    to: {
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

    tranId: {
      type: String,
      default: "",
    },

    valId: {
      type: String,
      default: "",
    },

    paymentSuccess: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
  }
);

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
