const User = require("../models/UserModel");
const sendToken = require("../utils/jwtToken");
const cloudinary = require("../cloudinary/index");
const validator = require("validator");
const fs = require("fs");

exports.getUserDetails = async (req, res) => {
  console.log(req.user.id);
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "No user found",
      });
    } else {
      return res.status(200).json({
        status: "success",
        message: "Here is the user details!!",
        user,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateUserDetails = async (req, res) => {
  try {
    const { name, email } = req.body;
    const id = req.user.id;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Please provide valid email" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Please select profile picture" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "SarlahiMarkt/ProfilePics",
    });

    console.log(result);

    const avatar = result.secure_url;

    fs.unlink(req.file?.path, (err) => {
      if (err) console.error("Failed to delete local file:", err);
    });

    const updatedProfile = await User.findByIdAndUpdate(
      id,
      {
        name,
        email,
        avatar,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    sendToken(updatedProfile, 200, res, "User details updated Successfully");
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updatePassword = async (req, res) => {
  const user = await User.findById(req.user.id).select("+password");
  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "You should login first",
    });
  }

  if (!req.body.oldPassword) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide your old password",
    });
  }

  const isPasswordMatched = await user.comparePassword(
    req.body.oldPassword,
    user.password
  );

  if (!isPasswordMatched) {
    return res.status(400).json({
      status: "fail",
      message: "Old password is incorrect",
    });
  }

  if (!req.body.newPassword) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide your new password",
    });
  }
  if (!req.body.confirmPassword) {
    return res.status(400).json({
      status: "fail",
      message: "Please confirm your new password",
    });
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return res.status(400).json({
      status: "fail",
      message: "Passwords doesn't match",
    });
  }

  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.confirmPassword;

  await user.save();

  sendToken(user, 200, res, "Password updated successfully");
};

// GETTING ALL THE USERS --> ADMIN PAGE

exports.getAllUsers = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (user.role === "admin") {
      const users = await User.find({});

      res.status(200).json({
        status: "success",
        users: users,
      });
    } else {
      return res.status(401).json({
        status: "fail",
        message: "Unauthorized User",
      });
    }
  } catch (error) {
    console.log("Error in getAllUsers controller", error.message);
    res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

// CHANGE USER ROLE --> Admin
exports.updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role: role },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      message: "User role updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log("Error in updateUserRole controller", error.message);
    res.status(500).json({ status: "fail", message: "Internal Server Error" });
  }
};
