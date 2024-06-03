const express = require("express");
const productController = require("../controllers/productController");
const authController = require("../controllers/authController");
const upload = require("../middlewares/multerMiddleware");

const router = express.Router();

router.route("/").get(productController.getAllProducts);
router.route("/category").post(productController.getProductsByCategory);
router.route("/search").post(productController.searchProduct);

router
  .route("/new")
  .post(
    authController.isAuthenticatedUser,
    authController.restrictTo("admin"),
    upload.array("files"),
    productController.createProduct
  );

router
  .route("/:id")
  .get(productController.getProductDetails)
  .patch(
    authController.isAuthenticatedUser,
    authController.restrictTo("admin"),
    productController.updateProduct
  )
  .delete(
    authController.isAuthenticatedUser,
    authController.restrictTo("admin"),
    productController.deleteProduct
  );

module.exports = router;
