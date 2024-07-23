const express = require("express");
const router = express.Router();
const profileController = require("../../controllers/profile.controller");

const image = require("../../middlewares/upload.middleware");

router.post("/", [image.upload, image.process], profileController.uploadAvatar);

module.exports = router;
