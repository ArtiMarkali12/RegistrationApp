const express = require("express");
const router = express.Router();
const feesController = require("../controllers/fees.controller");

/* CRUD Routes */
router.post("/", feesController.createFees);
router.get("/", feesController.getAllFees);
router.get("/:id", feesController.getFeesById);
router.get("/student/:studentId", feesController.getFeesByStudent);
router.put("/:id", feesController.updateFees);
router.delete("/:id", feesController.deleteFees);

module.exports = router;
