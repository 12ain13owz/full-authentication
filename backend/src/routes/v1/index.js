const express = require("express");
const health = require("./health.routes");
const auth = require("./auth.routes");
const user = require("./user.routes");
const profile = require("./profile.routes");

const router = express.Router();

router.use("/api/v1/health", health);
router.use("/api/v1/auth", auth);
router.use("/api/v1/user", user);
router.use("/api/v1/profile", profile);

module.exports = router;
