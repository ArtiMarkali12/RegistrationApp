const router = require("express").Router();
const controller = require("../controllers/employee.controller");

router.post("/", controller.createEmployee);
router.get("/", controller.getAllEmployees);

module.exports = router;
