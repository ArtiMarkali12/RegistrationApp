const router = require("express").Router();
const controller = require("../controllers/notification.controller");

// Fee notifications
router.get("/fee-due", controller.getFeeDueNotifications);

// All notifications (fee + student registration)
router.get("/all", controller.getAllNotifications);

// Student registration reminders
router.get("/student-registration", controller.getStudentRegistrationReminders);

// Mark notification as read
router.put("/mark-as-read/:notificationId", controller.markNotificationAsRead);

// Mark all notifications as read
router.put("/mark-all-as-read", controller.markAllNotificationsAsRead);

// Get unread notification count
router.get("/unread-count", controller.getUnreadNotificationCount);

// Debug endpoint
router.get("/debug", controller.debugNotifications);

module.exports = router;
