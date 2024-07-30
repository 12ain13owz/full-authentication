const express = require("express");
const router = express.Router();

const validate = require("../../middlewares/validate.middleware");
const verify = require("../../middlewares/verify.middleware");
const { deviceInfo } = require("../../middlewares/device-info.middleware");
const authSchema = require("../../schemas/auth.schema");
const authController = require("../../controllers/auth.controller");

router.post(
  "/register",
  validate(authSchema.register),
  authController.register
);
router.post(
  "/resend-verification",
  validate(authSchema.resendVerification),
  authController.resendVerification
);
router.post(
  "/verify-email",
  [validate(authSchema.verifyEmail), verify.email],
  authController.verifyEmail
);
router.post(
  "/login",
  [validate(authSchema.login), verify.recaptcha, deviceInfo],
  authController.login
);
router.post("/logout", validate(authSchema.logout), authController.logout);
router.post("/refresh", deviceInfo, authController.refreshToken);
router.get(
  "/devices",
  verify.accessToken,
  verify.isUserActive,
  authController.getDevices
);
router.delete(
  "/devices",
  verify.accessToken,
  verify.isUserActive,
  authController.deleteAllDevices
);
router.delete(
  "/devices/:refreshId",
  validate(authSchema.deleteDevice),
  verify.accessToken,
  verify.isUserActive,
  authController.deleteDevice
);
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
