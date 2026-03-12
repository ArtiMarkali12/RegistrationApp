const router = require("express").Router();
const controller = require("../controllers/notification.controller");

router.get("/fee-due", controller.getFeeDueNotifications);

router.get("/all", controller.getAllNotifications);

module.exports = router;
