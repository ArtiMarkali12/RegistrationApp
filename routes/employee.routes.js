const router = require("express").Router();
const controller = require("../controllers/employee.controller");

router.post("/", controller.createEmployee);
router.get("/", controller.getAllEmployees);

// ⚠️ SPECIFIC ROUTES MUST COME BEFORE /:employeeId
// 📋 Get Blocked Employees
router.get("/blocked", controller.getBlockedEmployees);

// 📋 Get Unblocked Employees
router.get("/unblocked", controller.getUnblockedEmployees);
router.get("/unblock", controller.getUnblockedEmployees); // Alias

// 🔍 Search Employees
router.get("/search", controller.searchEmployees);

// 🔢 Check Employee Count (Debug/Verification)
router.get("/check-count", controller.checkEmployeeCount);

// 🔐 Update Employee Password
router.put("/:employeeId/password", controller.updateEmployeePassword);

// 🚫 Block Employee
router.post("/:employeeId/block", controller.blockEmployee);

// ✅ Unblock Employee
router.put("/:employeeId/unblock", controller.unblockEmployee);

// 🔍 Get Employee by Employee ID
router.get("/:employeeId", controller.getEmployeeById);

// 🗑️ Delete Employee
router.delete("/:employeeId", controller.deleteEmployee);

module.exports = router;
