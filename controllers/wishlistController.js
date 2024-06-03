const Product = require("../models/ProductModel");
const User = require("../models/UserModel");
const Wishlist = require("../models/WishlistModel");

exports.addProductToWishlist = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ status: "fail", message: "Product not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ status: "fail", message: "User not found" });
    }

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({ userId, wishlistedProducts: [] });
    }

    if (wishlist.wishlistedProducts.includes(productId)) {
      return res
        .status(400)
        .json({ status: "fail", message: "Product already in wishlist" });
    }

    wishlist.wishlistedProducts.push(product);
    await wishlist.save();

    res.status(200).json({
      status: "success",
      message: "Product added to wishlist",
      wishlist,
    });
  } catch (error) {
    console.log("Error in addProductToWishlist controller", error);
    res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

exports.fetchWishlistedProducts = async (req, res) => {
  const userId = req.user.id;
  try {
    const wishlist = await Wishlist.findOne({ userId: userId }).populate(
      "wishlistedProducts"
    );
    if (!wishlist) {
      return res
        .status(400)
        .json({ status: "fail", message: "No wishlists found" });
    }
    if (wishlist.wishlistedProducts.length == 0) {
      res
        .status(400)
        .json({ status: "success", message: "No products in wishlist" });
    } else {
      res.status(200).json({ status: "success", wishlist });
    }
  } catch (error) {
    console.log("Error in fetchWishlistedProducts controller", error);
    res.status(500).json({ status: "fail", message: "Server error" });
  }
};

exports.removeFromWishlist = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;

  try {
    const wishlist = await Wishlist.findOne({ userId: userId });
    if (!wishlist) {
      return res
        .status(404)
        .json({ status: "fail", message: "Wishlist not found" });
    }

    const productIndex = wishlist.wishlistedProducts.indexOf(productId);
    if (productIndex === -1) {
      return res
        .status(400)
        .json({ status: "fail", message: "Product not in wishlist" });
    }

    wishlist.wishlistedProducts.splice(productIndex, 1);
    await wishlist.save();

    res.status(200).json({
      status: "success",
      message: "Product removed from wishlist",
      wishlist,
    });
  } catch (error) {
    console.error("Error in removeFromWishlist controller", error);
    res.status(500).json({
      status: "fail",
      message: "Server error",
    });
  }
};
