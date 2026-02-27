// const express = require("express");
// const router = express.Router();
// const feesController = require("../controllers/fees.controller");

// /* CRUD Routes */
// router.post("/", feesController.createFees);
// router.get("/", feesController.getAllFees);
// router.get("/:id", feesController.getFeesById);
// router.get("/student/:studentId", feesController.getFeesByStudent);
// router.put("/:id", feesController.updateFees);
// router.delete("/:id", feesController.deleteFees);

// module.exports = router;






const express = require("express");
const router = express.Router();
const feesController = require("../controllers/fees.controller");

/* Special Route - BEFORE /:id */
router.get("/payment-modes", feesController.getPaymentModes);

/* CRUD Routes */
router.post("/", feesController.createFees);
router.get("/", feesController.getAllFees);
router.get("/student/:studentId", feesController.getFeesByStudent);
router.get("/:id", feesController.getFeesById);
router.put("/:id", feesController.updateFees);
router.delete("/:id", feesController.deleteFees);

module.exports = router;