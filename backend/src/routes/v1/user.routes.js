const express = require("express");
const router = express.Router();
const userController = require("../../controllers/user.controller");
const userSchema = require("../../schemas/user.schema");
const verify = require("../../middlewares/verify.middleware");
const validate = require("../../middlewares/validate.middleware");

router.get(
  "/",
  [verify.accessToken, verify.isUserActive],
  userController.findAllUsers
);
router.get(
  "/:id",
  [
    verify.accessToken,
    verify.isUserActive,
    verify.checkRole(["USER"]),
    validate(userSchema.findUserById),
  ],
  userController.findUserById
);
router.get(
  "/email/:email",
  [
    verify.accessToken,
    verify.isUserActive,
    verify.checkRole(["USER"]),
    validate(userSchema.findUserByEmail),
  ],
  userController.findUserByEmail
);
router.patch(
  "/user/:id",
  [
    verify.accessToken,
    verify.isUserActive,
    verify.checkRole(["MODERATOR"]),
    validate(userSchema.updateProfile),
  ],
  userController.updateUserProfile
);
router.patch(
  "/roles/:id",
  [
    verify.accessToken,
    verify.isUserActive,
    verify.checkRole(["ADMIN"]),
    validate(userSchema.updateRoles),
  ],
  userController.updateUserRoles
);
router.delete(
  "/:id",
  [
    verify.accessToken,
    verify.isUserActive,
    verify.checkRole(["ADMIN"]),
    validate(userSchema.deleteUser),
  ],
  userController.deleteUser
);

module.exports = router;
