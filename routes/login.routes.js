const express = require("express");
const router = express.Router();
const loginController = require("../controllers/login.controller");

/* 🔐 Employee Login */
router.post("/", loginController.login);

/* 🔐 Forgot Password - Send OTP */
router.post("/forgot-password", loginController.forgotPassword);

/* 🔐 Verify OTP */
router.post("/verify-otp", loginController.verifyOTP);

/* 🔐 Reset Password */
router.post("/reset-password", loginController.resetPassword);

module.exports = router;