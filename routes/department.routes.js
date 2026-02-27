const express = require("express");
const router = express.Router();
const controller = require("../controllers/department.controller");

/* Create Department */
router.post("/", controller.createDepartment);

/* Get All Departments */
router.get("/", controller.getAllDepartments);

/* Get Department by ID */
router.get("/:id", controller.getDepartmentById);

/* Get Department by Name */
router.get("/name/:dept_name", controller.getDepartmentByName);

module.exports = router;
