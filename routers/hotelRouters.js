const express = require("express");
const {
  getHotels,
  addHotel,
  deleteHotel,
  updateHotel,
  singleHotel,
  searchHotelRoom,
} = require("../controllers/hotelControllers");
const { checkLogin } = require("../middlewares/checkLogin");
const hotelImageUpload = require("../middlewares/hotelImages");
const router = express.Router();

// get hotels
router.get("/get", getHotels);

// get hotel by id
router.get("/get/:id", singleHotel);

// add user
router.post("/post", checkLogin, hotelImageUpload, addHotel);

// update product
router.put("/update/:id", checkLogin, hotelImageUpload, updateHotel);

// delete product
router.delete("/delete/:id", checkLogin, deleteHotel);

// search hotel by filter
router.post("/search-hotel", searchHotelRoom);

module.exports = router;
