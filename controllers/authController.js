const User = require("../models/UserModel");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const sendToken = require("../utils/jwtToken");

exports.register = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Invalid body parameters" });
    }
    const {
      name,
      email,
      phone,
      address,
      avatar,
      password,
      role,
      passwordConfirm,
    } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Please provide valid email" });
    }

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    if (!passwordConfirm) {
      return res.status(400).json({ message: "Please confirm your password" });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({ message: "Your passwords doesn't match" });
    }

    const checkIfExistingUser = await User.findOne({ email });
    if (checkIfExistingUser) {
      return res.status(400).json({
        status: "error",
        message: "Email Already in use, Please login or use another email",
      });
    }

    // PROFILE AVATAR FROM "https://avatar.iran.liara.run"
    const queryParamsForAvatar = name.replace(" ", "+");
    const profileAvatar = `https://avatar.iran.liara.run/username?username=${queryParamsForAvatar}`;

    const user = {
      name,
      email,
      phone,
      address,
      avatar: profileAvatar,
      role,
      password,
      passwordConfirm,
    };

    const newUser = await User.create(user);

    newUser.password = undefined;

    sendToken(newUser, 201, res, "User registered successfully");
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "fail",
      message: "Can't complete registration",
    });
  }
};

exports.login = async (req, res) => {
  try {
    if (!req.body) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Please provide valid email" });
    }

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Incorrect email or password",
      });
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    user.password = undefined;

    sendToken(user, 200, res, "User logged in successfully");
  } catch (err) {
    console.log(err);
  }
};

exports.logout = async (req, res, next) => {
  console.log(req.cookies);
  res.cookie("jwt", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    status: true,
    message: "User logged out successfully",
  });
};

exports.isAuthenticatedUser = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    console.log(token);

    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "You are not logged in! Please login to continue",
      });
    }

    const decoded = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET_KEY
    );

    const user = await User.findById(decoded.id);

    req.user = user;

    next();
  } catch (err) {
    console.log(err);
  }
};

exports.restrictTo = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      const errMsg = `"${req.user.role}" is not allowed to perform this action`;
      return res.status(403).json({
        status: "fail",
        message: errMsg,
      });
    }
    next();
  };
};
