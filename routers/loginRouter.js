// external imports
const express = require("express");
const { login } = require("../controllers/loginControllers");

// internal imports

const {
  doLoginValidators,
  doLoginValidationHandler,
} = require("../middlewares/checkValidator");

// internal imports
const router = express.Router();

// add user
router.post("/post", doLoginValidators, doLoginValidationHandler, login);

module.exports = router;
