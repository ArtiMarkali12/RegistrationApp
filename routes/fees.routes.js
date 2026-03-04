const express = require("express");
const router = express.Router();
const feesController = require("../controllers/fees.controller");

/* Special Routes - BEFORE /:id */
router.get("/payment-modes", feesController.getPaymentModes);
router.get("/completed", feesController.getCompletedFees);
router.get("/pending", feesController.getPendingFees);
router.get("/registration/:registration_no", feesController.getFeesByRegistrationNo);
router.get("/receipt-counter", feesController.getReceiptCounter);

/* CRUD Routes */
router.post("/", feesController.createFees);
router.get("/", feesController.getAllFees);
router.get("/student/:studentId/summary", feesController.getFeesSummaryByStudent);
router.get("/student/:studentId", feesController.getFeesByStudent);
router.get("/:id", feesController.getFeesById);

/* Installment Payment Route */
router.post("/:id/pay-installment", feesController.payFeeInstallment);

/* Edit Installment Routes */
router.put("/:id/edit-installment", feesController.editFeeInstallment);
router.post("/:id/add-manual-installment", feesController.addManualInstallment);

/* Update & Delete */
router.put("/:id", feesController.updateFees);
router.delete("/:id", feesController.deleteFees);

module.exports = router;