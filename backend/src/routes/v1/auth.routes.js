const express = require("express");
const router = express.Router();

const validate = require("../../middlewares/validate.middleware");
const verify = require("../../middlewares/verify.middleware");
const authSchema = require("../../schemas/auth.schema");
const authController = require("../../controllers/auth.controller");

router.post(
  "/register",
  validate(authSchema.register),
  authController.register
);
router.get(
  "/verify/:token",
  [validate(authSchema.verifyEmail), verify.email],
  authController.verifyEmail
);
router.post("/login", validate(authSchema.login), authController.login);
router.post("/logout", authController.logout);
router.post("/refresh", authController.refreshToken);
router.post(
  "/forgot-password",
  validate(authSchema.forgotPassword),
  authController.forgotPassword
);
router.post(
  "/reset-password",
  validate(authSchema.resetPassword),
  authController.resetPassword
);

module.exports = router;
