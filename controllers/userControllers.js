const bcrypt = require("bcrypt");
const { unlink } = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const Hotel = require("../models/hotelModels");
const User = require("../models/userModels");

// get users
async function getUsers(req, res, next) {
  try {
    const users = await User.find({
      $or: [{ role: "hotel" }, { role: "customer" }],
    }).select("-password");
    res.status(200).json({
      users: users,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error!",
      success: false,
    });
  }
}

// add user
async function addUser(req, res) {
  try {
    const checkUser = await User.findOne({ email: req.body.email });
    if (checkUser) {
      res.status(302).json({
        message: "User already registered!!!",
        success: false,
      });
    } else {
      let newUser;
      const randomNumber = Math.ceil(Math.random() * 100000000);
      const date = new Date().getDate();
      const hours = new Date().getHours();
      const second = new Date().getSeconds();

      function zeroPad(num, numZeros) {
        var n = Math.abs(num);
        var zeros = Math.max(0, numZeros - Math.floor(n).toString().length);
        var zeroString = Math.pow(10, zeros).toString().substr(1);
        if (num < 0) {
          zeroString = "-" + zeroString;
        }
        return zeroString + n;
      }
      const code = zeroPad(randomNumber + date + hours + second, 8);
      const hashedPassword = await bcrypt.hash(code, 10);

      if (req.files && req.files.length > 0) {
        newUser = new User({
          ...req.body,
          password: hashedPassword,
          profileImageURL: `/uploads/userImages/${req.files[0].filename}`,
        });
      } else {
        newUser = new User({
          ...req.body,
          password: hashedPassword,
        });
      }

      const user = await newUser.save();

      if (req.body.role === "hotel") {
        const { name, email, phoneNumber, profileImageURL } = req.body;
        const hotel = new Hotel({
          email,
          user: {
            name,
            email,
            phoneNumber,
            profileImageURL,
          },
        });

        await hotel.save();
      }

      if (user) {
        const mailOptions = {
          from: process.env.NODEMAILER_EMAIL,
          to: req.body.email,
          subject: "Password for login",
          html: `<div>
          <h1>Hotel Information System</h1>
          <p>Your Password : ${code}</p>
          <p style="color: red; font-weight: 500;">Please do not reply to this message.</p>
          </div>`,
        };

        nodemailer
          .createTransport({
            service: "gmail",
            auth: {
              user: process.env.NODEMAILER_EMAIL,
              pass: process.env.NODEMAILER_PASS,
            },
          })
          .sendMail(mailOptions, (err, info) => {
            if (err) {
              console.log(err);
            } else {
              res.status(200).json({
                message: `Check your mail - ${req.body.email}`,
                success: true,
              });
            }
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

// get user by id
async function singleUser(req, res, next) {
  try {
    const id = req.params.id;
    const user = await User.findOne({ _id: id }).select("-password");
    const hotelInfo = await Hotel.findOne({ email: user?.email });
    if (user) {
      res.status(200).json({
        success: true,
        user,
        hotelInfo,
      });
    } else {
      res.status(400).json({
        message: "User not found!",
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

// update user(hotel)
async function updateUser(req, res, next) {
  const id = req.params.id;
  const hotel = await Hotel.findOne({ _id: id });
  const user = await User.findOne({ email: hotel?.email }).select("-password");

  if (req.files && req.files.length > 0) {
    // remove hotel thumbnail from directory
    if (hotel?.thumbnailImageURL !== "") {
      unlink(
        path.join(__dirname, `/../public${hotel?.thumbnailImageURL}`),
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
    }

    if (user?.profileImageURL !== "") {
      unlink(
        path.join(__dirname, `/../public${user?.profileImageURL}`),
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
    }
    const hotelImg = req.files.filter(
      (item) => item.fieldname === "thumbnailImageURL"
    );
    const userImg = req.files.filter(
      (item) => item.fieldname === "profileImageURL"
    );

    if (userImg.length > 0) {
      req.body.profileImageURL = `/uploads/userImages/${userImg[0].filename}`;
    } else {
      req.body.profileImageURL = user.profileImageURL;
    }

    if (hotelImg.length > 0) {
      req.body.thumbnailImageURL = `/uploads/userImages/${hotelImg[0].filename}`;
    } else {
      req.body.thumbnailImageURL = hotel.thumbnailImageURL;
    }
  } else {
    req.body.profileImageURL = user.profileImageURL;
    req.body.thumbnailImageURL = hotel.thumbnailImageURL;
  }
  // save hotel
  try {
    const {
      name,
      activate,
      phoneNumber,
      address,
      overview,
      locationId,
      checkIn,
      checkOut,
      policy,
      price,
      discount,
      profileImageURL = profileImageURL || user?.profileImageURL,
      thumbnailImageURL = thumbnailImageURL || hotel?.thumbnailImageURL,
    } = req.body;
    const result = await Hotel.findByIdAndUpdate(
      id,
      {
        address,
        overview,
        locationId,
        checkIn,
        checkOut,
        policy,
        price,
        discount,
        thumbnailImageURL,
        activate,
        user: {
          name,
          phoneNumber,
          profileImageURL,
        },
      },
      { new: true }
    );
    const result2 = await User.findByIdAndUpdate(
      user._id,
      {
        name,
        phoneNumber,
        profileImageURL,
      },
      {
        new: true,
      }
    );
    res.status(200).json({
      message: "Profile was updated successfully!",
      user: result2,
      hotel: result,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error!",
      success: false,
    });
  }
}

// update user(admin, customer)
async function updateNormalUser(req, res, next) {
  const id = req.params.id;
  const user = await User.findOne({ _id: id });

  if (req.files && req.files.length > 0) {
    // remove user image from directory
    if (user?.profileImageURL !== "") {
      unlink(
        path.join(__dirname, `/../public${user?.profileImageURL}`),
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
    }
    req.body.profileImageURL = `/uploads/userImages/${req.files[0].filename}`;
  }
  // save user
  try {
    const result = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    }).select("-password");
    res.status(200).json({
      message: "User was updated successfully!",
      user: result,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error!",
      success: false,
    });
  }
}

// password reset mail
async function resetPasswordMail(req, res, next) {
  const email = req.body.email;

  try {
    const randomNumber = Math.ceil(Math.random() * 100000000);
    const date = new Date().getDate();
    const hours = new Date().getHours();
    const second = new Date().getSeconds();

    function zeroPad(num, numZeros) {
      var n = Math.abs(num);
      var zeros = Math.max(0, numZeros - Math.floor(n).toString().length);
      var zeroString = Math.pow(10, zeros).toString().substr(1);
      if (num < 0) {
        zeroString = "-" + zeroString;
      }
      return zeroString + n;
    }
    const code = zeroPad(randomNumber + date + hours + second, 8);
    const hashedPassword = await bcrypt.hash(code, 10);
    const user = await User.findOne({ email: email });

    if (user) {
      const result = await User.findByIdAndUpdate(
        user?._id,
        { password: hashedPassword },
        {
          new: true,
        }
      );

      if (result) {
        const mailOptions = {
          from: process.env.NODEMAILER_EMAIL,
          to: email,
          subject: "Password for login",
          html: `<div>
          <h1>Hotel Information System</h1>
          <p>Your Password : ${code}</p>
          <p style="color: red; font-weight: 500;">Please do not reply to this message.</p>
          </div>`,
        };

        nodemailer
          .createTransport({
            service: "gmail",
            auth: {
              user: process.env.NODEMAILER_EMAIL,
              pass: process.env.NODEMAILER_PASS,
            },
          })
          .sendMail(mailOptions, (err, info) => {
            if (err) {
              console.log(err);
            } else {
              res.status(200).json({
                message: `Check your mail - ${email}`,
                success: true,
              });
            }
          });
      }
    } else {
      res.status(400).json({
        message: "User not found!",
        success: false,
      });
    }

    // const mailOptions = {
    //   from: process.env.NODEMAILER_EMAIL,
    //   to: email,
    //   subject: "Reset Password",
    //   html: `<div>
    //   <h1>Hotel Information System</h1>
    //   <p>Your New Password : ${code}</p>
    //   <p style="color: red; font-weight: 500;">Please do not reply to this message.</p>
    //   </div>`,
    // };

    // nodemailer
    //   .createTransport({
    //     service: "gmail",
    //     auth: {
    //       user: process.env.NODEMAILER_EMAIL,
    //       pass: process.env.NODEMAILER_PASS,
    //     },
    //   })
    //   .sendMail(mailOptions, (err, info) => {
    //     if (err) {
    //       console.log(err);
    //     } else {
    //       res.status(200).json({
    //         message: `Check your mail - ${email} for reset password`,
    //         success: true,
    //       });
    //     }
    //   });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error!",
      success: false,
    });
  }
}

// password change
async function changePassword(req, res) {
  try {
    const { email, oldPassword, newPassword } = req.body;
    const user = await User.findOne({ email: email });
    const match = await bcrypt.compare(oldPassword, user.password);

    if (match) {
      const password = await bcrypt.hash(newPassword, 10);
      const result = await User.findByIdAndUpdate(
        user?._id,
        { password },
        {
          new: true,
        }
      );

      if (Object.keys(result).length === 0 && result.constructor === Object) {
        res.status(300).json({
          message: "Sorry password not changed!!!",
          success: false,
        });
      } else {
        const mailOptions = {
          from: process.env.NODEMAILER_EMAIL,
          to: email,
          subject: "Password for login",
          html: `<div>
          <h1>Hotel Information System</h1>
          <p>Your New Password : ${newPassword}</p>
          <p style="color: red; font-weight: 500;">Please do not reply to this message.</p>
          </div>`,
        };

        nodemailer
          .createTransport({
            service: "gmail",
            auth: {
              user: process.env.NODEMAILER_EMAIL,
              pass: process.env.NODEMAILER_PASS,
            },
          })
          .sendMail(mailOptions, (err, info) => {
            if (err) {
              console.log(err);
            } else {
              res.status(200).json({
                message: "Successfully changed your password!!!",
                success: true,
              });
            }
          });
      }
    } else {
      res.status(300).json({
        message: "Your old password wrong!!!",
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

// update user status by admin
async function updateUserStatus(req, res) {
  try {
    const id = req.params.id;
    const result = await User.findByIdAndUpdate(
      id,
      { status: req.body.status },
      {
        new: true,
      }
    ).select("-password");
    res.status(200).json({
      message: "Status updated successfully!",
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error!",
      success: false,
    });
  }
}

module.exports = {
  getUsers,
  addUser,
  singleUser,
  updateUser,
  updateNormalUser,
  resetPasswordMail,
  changePassword,
  updateUserStatus,
};
