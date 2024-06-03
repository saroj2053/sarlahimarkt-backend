const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    address: [
      {
        firstName: String,
        lastName: String,
        company: String,
        address1: String,
        address2: String,
        city: String,
        country: String,
        postalCode: String,
        phone: String,
      },
    ],
    avatar: String,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);

  this.passwordConfirm = undefined;

  next();
});

userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

userSchema.methods.comparePassword = async function (candidatePd) {
  return await bcrypt.compare(candidatePd, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
