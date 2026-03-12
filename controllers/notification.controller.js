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
 * Get all fee notifications (including overdue)
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

    const result = await notificationService.getAllFeeNotifications(employeeId);

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.status(200).json({
      success: true,
      message: `Found ${result.count} fee notification(s)`,
      data: result.data
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFeeDueNotifications,
  getAllNotifications
};
