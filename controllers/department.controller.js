const Department = require("../models/department.model");

/* Create Department */
exports.createDepartment = async (req, res, next) => {
  try {
    const { dept_name, location } = req.body;
    const department = await Department.create({ dept_name, location });
    res.status(201).json({
      success: true,
      message: "Department created successfully",
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

/* Get All Departments */
exports.getAllDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find();
    res.status(200).json({
      success: true,
      data: departments,
    });
  } catch (error) {
    next(error);
  }
};

/* Get Department by ID */
exports.getDepartmentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }
    res.status(200).json({
      success: true,
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

/* Get Department by Name */
exports.getDepartmentByName = async (req, res, next) => {
  try {
    const { dept_name } = req.params;
    const department = await Department.findOne({ dept_name });
    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }
    res.status(200).json({
      success: true,
      data: department,
    });
  } catch (error) {
    next(error);
  }
};
