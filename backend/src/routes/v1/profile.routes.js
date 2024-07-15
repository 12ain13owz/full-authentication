const express = require("express");
const router = express.Router();
const profileController = require("../../controllers/profile.controller");
const validate = require("../../middlewares/validate.middleware");
const verify = require("../../middlewares/verify.middleware");
const image = require("../../middlewares/upload.middleware");
const profielSchema = require("../../schemas/profile.schema");

router.get(
  "/",
  [verify.accessToken, verify.isUserActive],
  profileController.getProfile
);
router.patch(
  "/",
  [
    verify.accessToken,
    verify.isUserActive,
    validate(profielSchema.updateProfile),
  ],
  profileController.updateProfile
);
router.post(
  "/avatar",
  [verify.accessToken, verify.isUserActive, image.upload, image.process],
  profileController.uploadImage
);
router.patch(
  "/avatar",
  [
    verify.accessToken,
    verify.isUserActive,
    validate(profielSchema.updateAvatar),
  ],
  profileController.updateAvatar
);
router.patch(
  "/changes-password",
  [
    verify.accessToken,
    verify.isUserActive,
    validate(profielSchema.changesPassword),
  ],
  profileController.changesPassword
);

module.exports = router;
