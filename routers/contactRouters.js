const express = require("express");
const { addContactInfo } = require("../controllers/contactControllers");
const router = express.Router();

// add contact info
router.post("/", addContactInfo);

module.exports = router;
