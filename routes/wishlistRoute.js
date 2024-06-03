const express = require("express");
const authController = require("../controllers/authController");
const wishlistController = require("../controllers/wishlistController");

const router = express.Router();

router
  .route("/")
  .get(
    authController.isAuthenticatedUser,
    wishlistController.fetchWishlistedProducts
  )
  .post(
    authController.isAuthenticatedUser,
    wishlistController.addProductToWishlist
  );

router
  .route("/delete")
  .post(
    authController.isAuthenticatedUser,
    wishlistController.removeFromWishlist
  );

module.exports = router;
