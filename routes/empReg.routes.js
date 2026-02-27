const express = require("express");
const router = express.Router();
const empController = require("../controllers/empReg.controller");

/* Register Employee */
router.post("/", empController.registerEmployee);

/* Get All Employees */
router.get("/", empController.getEmployees);

module.exports = router;