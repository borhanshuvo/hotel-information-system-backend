const express = require("express");
const {
  getRooms,
  singleRoom,
  addRoom,
  updateRoom,
  deleteRoom,
  getRoomsByEmail,
} = require("../controllers/roomControllers");
const { checkLogin } = require("../middlewares/checkLogin");
const roomImageUpload = require("../middlewares/roomImages");
const router = express.Router();

// get rooms
router.get("/get-room", getRooms);

// get rooms by user email
router.get("/get-room/:email", checkLogin, getRoomsByEmail);

// get room by id
router.get("/get-room/:id", singleRoom);

// add room
router.post("/add-room", checkLogin, roomImageUpload, addRoom);

// update room
router.put("/update/:id", checkLogin, roomImageUpload, updateRoom);

// delete room
router.delete("/delete/:id", checkLogin, deleteRoom);

module.exports = router;
