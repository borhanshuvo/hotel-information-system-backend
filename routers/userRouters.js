const express = require("express");
const {
  getUsers,
  addUser,
  singleUser,
  updateUser,
  updateNormalUser,
  resetPasswordMail,
  changePassword,
  updateUserStatus,
} = require("../controllers/userControllers");
const { checkLogin } = require("../middlewares/checkLogin");
const userImageUpload = require("../middlewares/userImages");

const router = express.Router();

// get users
router.get("/get-user", checkLogin, getUsers);

// get user by id
router.get("/get-user/:id", checkLogin, singleUser);

// add user
router.post("/add-user", userImageUpload, addUser);

// reset password
router.post("/reset-password", resetPasswordMail);

// reset password
router.post("/password-change", checkLogin, changePassword);

// update user(hotel)
router.put("/update/:id", checkLogin, userImageUpload, updateUser);

// update user(admin, customer)
router.put("/user-update/:id", checkLogin, userImageUpload, updateNormalUser);

// update user status by admin
router.put("/update-user-status/:id", checkLogin, updateUserStatus);

module.exports = router;
