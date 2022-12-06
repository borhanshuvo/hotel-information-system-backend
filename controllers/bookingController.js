const SSLCommerzPayment = require("sslcommerz-lts");
const { v4: uuidv4 } = require("uuid");
const Booking = require("../models/bookingModel");
const Hotel = require("../models/hotelModels");
const Room = require("../models/roomModels");

// add booking
async function addBooking(req, res) {
  const { customerName, customerEmail, customerPhoneNumber, price } = req.body;

  const bookingData = {
    total_amount: price,
    currency: "BDT",
    tran_id: uuidv4(),
    success_url: `${process.env.BACKEND_URL}/booking/ssl-payment-success`,
    fail_url: `${process.env.BACKEND_URL}/booking/ssl-payment-fail`,
    cancel_url: `${process.env.BACKEND_URL}/booking/ssl-payment-cancel`,
    shipping_method: "No",
    product_name: "Booking.",
    product_category: "Electronic",
    product_profile: "general",
    cus_name: customerName,
    cus_email: customerEmail,
    cus_add1: "Dhaka",
    cus_add2: "Dhaka",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: customerPhoneNumber,
    cus_fax: "01711111111",
    multi_card_name: "mastercard",
    value_a: "ref001_A",
    value_b: "ref002_B",
    value_c: "ref003_C",
    value_d: "ref004_D",
    ipn_url: `${process.env.BACKEND_URL}/booking/ssl-payment-notification`,
  };

  req.body.tranId = bookingData.tran_id;

  const sslcommerz = new SSLCommerzPayment(
    process.env.STORE_ID,
    process.env.STORE_PASSWORD,
    false
  );

  sslcommerz.init(bookingData).then((data) => {
    if (data?.GatewayPageURL) {
      const booking = new Booking(req.body);
      const result = booking.save();
      return res.status(200).json({
        url: data?.GatewayPageURL,
        success: true,
      });
    } else {
      return res.status(400).json({
        message: "Session was not successful",
        success: false,
      });
    }
  });
}

async function paymentSuccess(req, res) {
  const bookingId = await Booking.findOne({ tranId: req.body.tran_id });
  const valId = req.body.val_id;

  await Booking.findByIdAndUpdate(
    bookingId._id,
    { valId },
    {
      new: true,
    }
  );
  await Room.findByIdAndUpdate(
    bookingId.rooms,
    { available: false },
    {
      new: true,
    }
  );

  return res.redirect(`${process.env.FRONTEND_URL}/order/${req.body.tran_id}`);
}

async function cancelPayment(req, res) {
  const bookingId = await Booking.findOne({ tranId: req.body.tran_id });
  const deletedBookingInfo = await Booking.findByIdAndDelete({
    _id: bookingId._id,
  });

  return res.redirect(`${process.env.FRONTEND_URL}`);
}

async function paymentFail(req, res) {
  const bookingId = await Booking.findOne({ tranId: req.body.tran_id });
  const deletedBookingInfo = await Booking.findByIdAndDelete({
    _id: bookingId._id,
  });

  return res.redirect(`${process.env.FRONTEND_URL}`);
}

// booking info by user
async function getBookingInfo(req, res) {
  try {
    const email = req.body.email;
    const bookingUser = await Booking.find({
      customerEmail: email,
    })
      .populate("hotels")
      .populate("rooms")
      .sort({ updatedAt: -1 });
    if (bookingUser.length > 0) {
      res.status(200).json({
        bookingUser: bookingUser,
        success: true,
      });
    } else {
      res.status(400).json({
        message: "Not found!",
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

// booking info by tran id
async function getBookingInfoByTran(req, res) {
  try {
    const tranId = req.params.id;
    const result = await Booking.findOne({ tranId: tranId });

    if (Object.keys(result).length === 0 && result.constructor === Object) {
      res.status(400).json({
        message: "Not found!",
        success: false,
      });
    } else {
      res.status(200).json({
        bookingInfo: result,
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

// validate order
async function validateOrder(req, res) {
  try {
    const tranId = req.body.tranId;
    const valId = req.body.valId;
    const result = await Booking.findOne({ tranId: tranId });

    if (Object.keys(result).length === 0 && result.constructor === Object) {
      res.status(300).json({
        message: "Sorry not found any data!!!",
        success: false,
      });
    } else {
      if (valId === result?.valId) {
        const updatePaymentSuccess = await Booking.findByIdAndUpdate(
          result._id,
          { paymentSuccess: true },
          {
            new: true,
          }
        );
        if (
          Object.keys(updatePaymentSuccess).length === 0 &&
          updatePaymentSuccess.constructor === Object
        ) {
          res.status(307).json({
            message: "Already validated!",
            success: false,
          });
        } else {
          const hotelInfo = await Hotel.findOne({ _id: result?.hotels });
          const prevRating = hotelInfo?.rating;
          const newRating = Math.ceil((prevRating + req.body.rating) / 2);
          await Hotel.findByIdAndUpdate(
            hotelInfo?._id,
            {
              rating: newRating,
            },
            { new: true }
          );
          res.status(200).json({
            message: "Payment validated successfully!",
            success: true,
          });
        }
      } else {
        res.status(307).json({
          message: "Sorry your booking not validate!",
          success: false,
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

// all booking info
async function getAllBookingInfo(req, res) {
  try {
    const bookingInfo = await Booking.find()
      .populate("hotels")
      .populate("rooms")
      .sort({ updatedAt: -1 });
    if (bookingInfo.length > 0) {
      res.status(200).json({
        bookingInfo: bookingInfo,
        success: true,
      });
    } else {
      res.status(400).json({
        message: "Not found!",
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
  addBooking,
  paymentSuccess,
  cancelPayment,
  paymentFail,
  getBookingInfo,
  getAllBookingInfo,
  getBookingInfoByTran,
  validateOrder,
};
