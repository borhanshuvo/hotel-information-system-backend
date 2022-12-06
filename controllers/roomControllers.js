// external import
const { unlink } = require("fs");
const path = require("path");
const Room = require("../models/roomModels");

// get rooms
async function getRooms(req, res, next) {
  try {
    const rooms = await Room.find();
    res.status(200).json({
      rooms: rooms,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error!",
      success: false,
    });
  }
}

// get rooms by user
async function getRoomsByEmail(req, res, next) {
  try {
    const email = req.params.email;
    const rooms = await Room.find({ hotelEmail: email });
    res.status(200).json({
      rooms: rooms,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error!",
      success: false,
    });
  }
}

// add room
async function addRoom(req, res) {
  let newRoomInfo;

  if (req.files && req.files.length > 0) {
    newRoomInfo = new Room({
      ...req.body,
      roomImageURL: `/uploads/roomImages/${req.files[0].filename}`,
    });
  }

  try {
    const result = await newRoomInfo.save();

    if (result) {
      res.status(200).json({
        message: "Room information added successfully!",
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

// update room
async function updateRoom(req, res, next) {
  const id = req.params.id;
  const room = await Room.findOne({ _id: id });
  if (req.files && req.files.length > 0) {
    // remove room image from directory
    if (room?.roomImageURL !== "") {
      unlink(
        path.join(__dirname, `/../public${hotel?.roomImageURL}`),
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
    }
    req.body.roomImageURL = `/uploads/roomImages/${req.files[0].filename}`;
  }
  // save room
  try {
    const result = await Room.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({
      message: "Room was updated successfully!",
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

// delete room
async function deleteRoom(req, res, next) {
  try {
    const id = req.params.id;
    const room = await Room.findOne({ _id: id });

    const deletedRoom = await Room.findByIdAndDelete({
      _id: id,
    });

    // remove room image from directory
    if (room?.roomImageURL !== "") {
      unlink(path.join(__dirname, `/../public${room?.roomImageURL}`), (err) => {
        if (err) {
          console.log(err);
        }
      });
    }
    res.status(200).json({
      message: "Room was deleted successfully!",
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error!",
      success: false,
    });
  }
}

// get room by id
async function singleRoom(req, res, next) {
  try {
    const id = req.params.id;
    const room = await Room.findOne({ _id: id });

    if (room) {
      res.status(200).json({
        room: room,
        success: true,
      });
    } else {
      res.status(400).json({
        message: "Room not found!",
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
  getRooms,
  singleRoom,
  addRoom,
  updateRoom,
  deleteRoom,
  getRoomsByEmail,
};
