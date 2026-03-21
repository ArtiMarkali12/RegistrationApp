const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/superAdmin.controller");

router.post("/", ctrl.createSuperAdmin);
router.get("/", ctrl.getAllSuperAdmins);
router.get("/:id", ctrl.getSuperAdminById);
router.post("/login", ctrl.superAdminLogin);

// Password Management
router.post("/forgot-password", ctrl.forgotPassword);
router.post("/reset-password", ctrl.resetPassword);
router.put("/update-password", ctrl.updatePassword);

// Get Employees under SuperAdmin
router.get("/:superAdminId/employees", ctrl.getEmployeesUnderSuperAdmin);

// Get Students under SuperAdmin
router.get("/:superAdminId/students", ctrl.getStudentsUnderSuperAdmin);

// Get Dashboard Counts (Employee & Student Count)
router.get("/:superAdminId/dashboard-counts", ctrl.getDashboardCounts);

// Get Notification Count for SuperAdmin
router.get("/:superAdminId/notifications/count", ctrl.getNotificationCount);

module.exports = router;
