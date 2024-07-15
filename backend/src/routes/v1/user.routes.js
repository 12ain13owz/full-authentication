const express = require("express");
const router = express.Router();
const userController = require("../../controllers/user.controller");
const userSchema = require("../../schemas/user.schema");
const verify = require("../../middlewares/verify.middleware");
const validate = require("../../middlewares/validate.middleware");

router.get(
  "/users",
  [verify.accessToken, verify.isUserActive],
  userController.findAllUsers
);
router.get(
  "/:id",
  [
    verify.accessToken,
    verify.isUserActive,
    verify.checkRole("update"),
    validate(userSchema.findUserById),
  ],
  userController.findUserById
);
router.patch(
  "/profile/:id",
  [
    verify.accessToken,
    verify.isUserActive,
    verify.checkRole("update"),
    validate(userSchema.updateProfile),
  ],
  userController.updateUserProfile
);
router.patch(
  "/roles/:id",
  [
    verify.accessToken,
    verify.isUserActive,
    verify.checkRole("update"),
    validate(userSchema.updateRoles),
  ],
  userController.updateUserRoles
);
router.delete(
  "/:id",
  [
    verify.accessToken,
    verify.isUserActive,
    verify.checkRole("delete"),
    validate(userSchema.deleteUser),
  ],
  userController.deleteUser
);

module.exports = router;
