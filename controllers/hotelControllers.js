// external import
const { unlink } = require("fs");
const path = require("path");
const Booking = require("../models/bookingModel");
const Hotel = require("../models/hotelModels");
const Room = require("../models/roomModels");
const User = require("../models/userModels");

// get hotels
async function getHotels(req, res, next) {
  try {
    const hotels = await Hotel.find({ activate: true });
    res.status(200).json({
      hotels: hotels,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error!",
      success: false,
    });
  }
}

// add hotel
async function addHotel(req, res) {
  let newHotelInfo;

  if (req.files && req.files.length > 0) {
    newHotelInfo = new Hotel({
      ...req.body,
      thumbnailImageURL: `/uploads/hotelImages/${req.files[0].filename}`,
    });
  }

  try {
    const checkHotel = await Hotel.findOne({ email: req.body.email });
    if (checkHotel) {
      res.status(302).json({
        message: "This hotel already registered!!!",
        success: false,
      });
    } else {
      const result = await newHotelInfo.save();

      if (result) {
        res.status(200).json({
          message: "Hotel information added successfully!",
          success: true,
        });
      }
    }
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error!",
      success: false,
    });
  }
}

// update hotel
async function updateHotel(req, res, next) {
  const id = req.params.id;
  const hotel = await Hotel.findOne({ _id: id });
  const user = await User.findOne({ email: hotel?.email });

  if (req.files && req.files.length > 0) {
    // remove hotel image from directory
    if (hotel?.thumbnailImageURL !== "") {
      unlink(
        path.join(
          __dirname,
          `/../public/uploads/hotelImages/${hotel?.thumbnailImageURL}`
        ),
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
    }
    req.body.thumbnailImageURL = `/uploads/hotelImages/${req.files[0].filename}`;
  }
  // save hotel
  try {
    const result = await Hotel.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({
      message: "Hotel was updated successfully!",
      updateResult: result,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error!",
      success: false,
    });
  }
}

// delete hotel
async function deleteHotel(req, res, next) {
  try {
    const id = req.params.id;
    const hotel = await Hotel.findOne({ _id: id });

    const deletedHotel = await Hotel.findByIdAndDelete({
      _id: id,
    });

    // remove hotel image from directory
    if (hotel?.thumbnailImageURL !== "") {
      unlink(
        path.join(
          __dirname,
          `/../public/uploads/hotelImages/${hotel?.thumbnailImageURL}`
        ),
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
    }
    res.status(200).json({
      message: "Hotel was deleted successfully!",
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error!",
      success: false,
    });
  }
}

// get hotel by id
async function singleHotel(req, res, next) {
  try {
    const id = req.params.id;
    const { adult, child } = req.query;
    const hotel = await Hotel.findOne({ _id: id });
    const room = await Room.find({
      hotelEmail: hotel?.email,
      adult: { $gte: adult },
      child: { $gte: child },
      available: true,
    });

    if (hotel) {
      res.status(200).json({
        hotel: hotel,
        room: room,
        success: true,
      });
    } else {
      res.status(400).json({
        message: "Hotel not found!",
        success: false,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error!",
      success: false,
    });
  }
}

// search hotel by filter
async function searchHotelRoom(req, res) {
  try {
    const { adult, child, hotels, startDate, endDate } = req.body;

    const bookingModel = await Booking.find({});
    const room = await Room.find({
      hotelId: hotels,
    });
    const hotel = await Room.findOne({ hotelId: hotels });

    if (room.length > 0) {
      res.status(200).json({
        room: room,
        success: true,
      });
    } else {
      res.status(200).json({
        success: false,
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
  getHotels,
  singleHotel,
  addHotel,
  updateHotel,
  deleteHotel,
  searchHotelRoom,
};
