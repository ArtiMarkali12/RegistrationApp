const router = require("express").Router();
const controller = require("../controllers/notification.controller");

/* ===== NOTIFICATION ROUTES ===== */

// Get upcoming fee due notifications (within threshold days)
// Usage: GET /api/notifications/fee-due?employeeId=xxx&days=7
router.get("/fee-due", controller.getFeeDueNotifications);

// Get all fee notifications (including overdue)
// Usage: GET /api/notifications/all?employeeId=xxx
router.get("/all", controller.getAllNotifications);

module.exports = router;
