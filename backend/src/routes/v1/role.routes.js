const express = require("express");
const router = express.Router();
const roleController = require("../../controllers/role.controller");
const verify = require("../../middlewares/verify.middleware");

router.get(
  "/",
  [verify.accessToken, verify.isUserActive],
  roleController.findAllRoles
);

module.exports = router;
