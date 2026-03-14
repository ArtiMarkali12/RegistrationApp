const notificationService = require("../services/notification.service");

const getFeeDueNotifications = async (req, res, next) => {
  try {
    const { employeeId } = req.query;
    const days = parseInt(req.query.days) || 7;

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: "Employee ID is required"
      });
    }

    const result = await notificationService.getFeeDueNotifications(employeeId, days);

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.status(200).json({
      success: true,
      message: `Found ${result.count} upcoming fee notification(s)`,
      data: result.data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/notifications/all
 * Get all notifications (fee + student registration)
 */
const getAllNotifications = async (req, res, next) => {
  try {
    const { employeeId } = req.query;

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: "Employee ID is required"
      });
    }

    const result = await notificationService.getAllNotifications(employeeId);

    res.status(200).json({
      success: true,
      message: `Found ${result.count} notification(s)`,
      data: result.data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/notifications/student-registration
 * Get student registration reminders
 */
const getStudentRegistrationReminders = async (req, res, next) => {
  try {
    const { employeeId } = req.query;

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: "Employee ID is required"
      });
    }

    const result = await notificationService.getStudentRegistrationReminders(employeeId);

    res.status(200).json({
      success: true,
      message: `Found ${result.count} student registration reminder(s)`,
      data: result.data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/notifications/mark-as-read/:notificationId
 * Mark a notification as read
 */
const markNotificationAsRead = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    const { employeeId } = req.body;

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: "Employee ID is required"
      });
    }

    const result = await notificationService.markNotificationAsRead(notificationId, employeeId);

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/notifications/mark-all-as-read
 * Mark all notifications as read
 */
const markAllNotificationsAsRead = async (req, res, next) => {
  try {
    const { employeeId } = req.body;

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: "Employee ID is required"
      });
    }

    const result = await notificationService.markAllNotificationsAsRead(employeeId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/notifications/unread-count
 * Get unread notification count
 */
const getUnreadNotificationCount = async (req, res, next) => {
  try {
    const { employeeId } = req.query;

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: "Employee ID is required"
      });
    }

    const result = await notificationService.getUnreadNotificationCount(employeeId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFeeDueNotifications,
  getAllNotifications,
  getStudentRegistrationReminders,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadNotificationCount
};
