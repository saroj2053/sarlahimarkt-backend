const Cart = require("../models/CartModel");

exports.addItemsToCart = async (req, res) => {};

exports.getAllCartItems = async (req, res) => {
  try {
    const loggedInUser = req.user.id;

    const allCartItems = await Cart.find({
      userId: loggedInUser,
    }).populate("productId");

    res.status(200).json({
      cartItems: allCartItems,
      status: "success",
      message: "Retrieved cart items",
    });
  } catch (err) {
    console.log("Error in getAllCartItems controller", err.message);
    res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};
