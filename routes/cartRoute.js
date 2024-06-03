const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const cartController = require("../controllers/cartController");

router
  .route("/")
  .get(authController.isAuthenticatedUser, cartController.getAllCartItems)
  .post(authController.isAuthenticatedUser, cartController.addItemsToCart);

module.exports = router;
