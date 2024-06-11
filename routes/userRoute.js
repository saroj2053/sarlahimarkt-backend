const express = require("express");
const authController = require("./../controllers/authController");
const userController = require("../controllers/userController");
const upload = require("../middlewares/multerMiddleware");

const router = express.Router();

router.route("/register").post(authController.register);
router.route("/login").post(authController.login);

router
  .route("/logout")
  .post(authController.isAuthenticatedUser, authController.logout);

router
  .route("/profile")
  .get(authController.isAuthenticatedUser, userController.getUserDetails);

router
  .route("/profile/update")
  .patch(
    authController.isAuthenticatedUser,
    upload.single("profilePic"),
    userController.updateUserDetails
  );

router
  .route("/password/update")
  .patch(authController.isAuthenticatedUser, userController.updatePassword);

router
  .route("/address")
  .post(authController.isAuthenticatedUser, userController.addAddress);

router
  .route("/address")
  .get(authController.isAuthenticatedUser, userController.fetchAddressData);

// for admin --> getAllUsers
router
  .route("/allUsers")
  .get(
    authController.isAuthenticatedUser,
    authController.restrictTo("admin"),
    userController.getAllUsers
  );

router
  .route("/:id/update")
  .patch(
    authController.isAuthenticatedUser,
    authController.restrictTo("admin"),
    userController.updateUserRole
  );

module.exports = router;
