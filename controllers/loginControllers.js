const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// internal import
const User = require("../models/userModels");

async function login(req, res, next) {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (Object.keys(user).length === 0 && user.constructor === Object) {
      res.status(500).json({
        message: "Authentication error!",
        success: false,
      });
    } else {
      if (user?.status) {
        const isValidPassword = await bcrypt.compare(
          req.body.password,
          user.password
        );

        // user object
        const userObject = {
          id: user._id,
          name: user.name,
          email: user.email,
        };

        // token generate
        const accessToken = jwt.sign(userObject, process.env.JWT_SECRET, {
          expiresIn: "1 days",
        });

        if (isValidPassword) {
          const { password, ...rest } = user._doc;
          res.status(200).json({ user: rest, accessToken, success: true });
        } else {
          res.status(500).json({
            message: "Authentication error!",
            success: false,
          });
        }
      } else {
        res.status(500).json({
          message: "Admin deactivate your account!",
          success: false,
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error!",
      success: false,
    });
  }
}

module.exports = {
  login,
};
