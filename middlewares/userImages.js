const uploader = require("../utilities/imageUploads");

function userImageUpload(req, res, next) {
  const upload = uploader(
    "userImages",
    ["image/jpeg", "image/png", "image/jpg"],
    10000000,
    "Only .jpg, jpeg and .png format allowed!"
  );

  // call the middleware function
  upload.any()(req, res, (err) => {
    if (err) {
      res.status(500).json({
        errors: {
          avatar: {
            msg: err,
          },
        },
      });
    } else {
      next();
    }
  });
}

module.exports = userImageUpload;
