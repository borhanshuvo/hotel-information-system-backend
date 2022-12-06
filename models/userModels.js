// external imports
const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      trim: true,
    },

    email: {
      type: String,
      require: true,
      trim: true,
      lowercase: true,
      unique: true,
    },

    phoneNumber: {
      type: String,
      default: "",
    },

    profileImageURL: {
      type: String,
      default: "",
    },

    password: {
      type: String,
      require: true,
    },

    status: {
      type: Boolean,
      default: true,
    },

    role: {
      type: String,
      enum: ["hotel", "customer"],
    },
  },

  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
