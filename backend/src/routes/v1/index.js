const express = require("express");
const health = require("./health.routes");
const auth = require("./auth.routes");
const user = require("./user.routes");
const profile = require("./profile.routes");
const avatar = require("./avatar.routes");
const role = require("./role.routes");

const router = express.Router();

router.use("/api/v1/health", health);
router.use("/api/v1/auth", auth);
router.use("/api/v1/users", user);
router.use("/api/v1/profile", profile);
router.use("/api/v1/avatar", avatar);
router.use("/api/v1/role", role);

module.exports = router;
