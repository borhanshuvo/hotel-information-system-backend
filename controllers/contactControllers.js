const Contact = require("../models/contactModels");
const nodemailer = require("nodemailer");

// add contact info
async function addContactInfo(req, res) {
  try {
    const contact = new Contact(req.body);
    const result = contact.save();

    if (result) {
      const mailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: process.env.NODEMAILER_EMAIL,
        subject: req.body.name,
        html: `<div>
        <h3>${req.body.name}</h3>
        <h4>${req.body.email}</h4>
        <p>${req.body.message}</p>
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
              message: "Send successfully!",
              success: true,
            });
          }
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
  addContactInfo,
};
