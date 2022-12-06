const express = require("express");
const {
  addBooking,
  paymentSuccess,
  cancelPayment,
  paymentFail,
  getBookingInfo,
  getAllBookingInfo,
  getBookingInfoByTran,
  validateOrder,
} = require("../controllers/bookingController");
const { checkLogin } = require("../middlewares/checkLogin");
const router = express.Router();

// all booking info
router.get("/get-all/booking", checkLogin, getAllBookingInfo);

// validate booking
router.get("/transaction/:id", getBookingInfoByTran);
router.post("/validate", validateOrder);

// booking info by user
router.post("/get-booking", getBookingInfo);

// add booking
router.post("/add-booking", addBooking);
router.post("/ssl-payment-success", paymentSuccess);
router.post("/ssl-payment-cancel", cancelPayment);
router.post("/ssl-payment-fail", paymentFail);

//

module.exports = router;
