const router = require("express").Router();
const controller = require("../controllers/employee.controller");

router.post("/", controller.createEmployee);
router.get("/", controller.getAllEmployees);

// 📋 Get Blocked Employees
router.get("/blocked", controller.getBlockedEmployees);

// 🔐 Get Employees by Access Rights
router.get("/rights", controller.getEmployeesByAccessRights);

// 🔍 Get Employee by Employee ID
router.get("/:employeeId", controller.getEmployeeById);

// 🔐 Update Employee Password
router.put("/:employeeId/password", controller.updateEmployeePassword);

// 🗑️ Delete Employee
router.delete("/:employeeId", controller.deleteEmployee);

// 🚫 Block Employee
router.put("/:employeeId/block", controller.blockEmployee);

// ✏️ Update Employee Rights
router.put("/:employeeId/rights", controller.updateEmployeeRights);

module.exports = router;
