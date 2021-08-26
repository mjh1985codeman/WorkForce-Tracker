//This is the "central hub" to pull the other js files together.
const express = require("express");
const router = express.Router();

// router.use(require("./departments"));
router.use(require("./employees"));
// router.use(require("./roles"));

module.exports = router;
