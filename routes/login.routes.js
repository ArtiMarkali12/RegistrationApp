const express = require("express");
const router = express.Router();
const loginController = require("../controllers/login.controller");

/* 🔐 Employee Login */
router.post("/", loginController.login);

module.exports = router;