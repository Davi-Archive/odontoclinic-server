const express = require("express");
const router = express.Router();
const { createUser, loginUser, getUser } = require("../controller");

router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/me", getUser);

module.exports = router;
