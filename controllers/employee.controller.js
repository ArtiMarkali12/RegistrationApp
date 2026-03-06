const Employee = require("../models/employee.model");
const bcrypt = require("bcryptjs");

const createEmployee = async (req, res, next) => {
  try {
    const emp = await Employee.create(req.body);
    res.status(201).json({
      success: true,
      data: emp
    });
  } catch (err) {
    next(err);
  }
};

const getAllEmployees = async (req, res, next) => {
  try {
    const emp = await Employee.find();
    res.json({
      success: true,
      data: emp
    });
  } catch (err) {
    next(err);
  }
};

// 🔍 Get Employee by Employee ID
const getEmployeeById = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const employee = await Employee.findOne({ employeeId });
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }
    
    res.json({
      success: true,
      data: employee
    });
  } catch (err) {
    next(err);
  }
};

// 🔐 Update Employee Password (using old password)
const updateEmployeePassword = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const { oldPassword, newPassword, confirmPassword } = req.body;
    
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Old password, new password and confirm password are required"
      });
    }
    
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match"
      });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long"
      });
    }
    
    const employee = await Employee.findOne({ employeeId });
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }
    
    const isMatch = await bcrypt.compare(oldPassword, employee.password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Old password is incorrect"
      });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    employee.password = hashedPassword;
    await employee.save();
    
    res.json({
      success: true,
      message: "Password updated successfully"
    });
  } catch (err) {
    next(err);
  }
};

// 🗑️ Delete Employee
const deleteEmployee = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const deletedEmployee = await Employee.findOneAndDelete({ employeeId });
    
    if (!deletedEmployee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }
    
    res.json({
      success: true,
      message: "Employee deleted successfully"
    });
  } catch (err) {
    next(err);
  }
};

// 🚫 Block Employee (PUT request)
const blockEmployee = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    
    const employee = await Employee.findOne({ employeeId });
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }
    
    employee.isBlocked = true;
    await employee.save();
    
    res.json({
      success: true,
      message: "Employee blocked successfully",
      data: employee
    });
  } catch (err) {
    next(err);
  }
};

// 📋 Get All Blocked Employees
const getBlockedEmployees = async (req, res, next) => {
  try {
    const blockedEmployees = await Employee.find({ isBlocked: true });
    
    res.json({
      success: true,
      count: blockedEmployees.length,
      data: blockedEmployees
    });
  } catch (err) {
    next(err);
  }
};

// ✏️ Update Employee Rights
const updateEmployeeRights = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const { accessRights } = req.body;
    
    if (!accessRights || !Array.isArray(accessRights)) {
      return res.status(400).json({
        success: false,
        message: "accessRights must be an array"
      });
    }
    
    const employee = await Employee.findOne({ employeeId });
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }
    
    employee.accessRights = accessRights;
    await employee.save();
    
    res.json({
      success: true,
      message: "Employee rights updated successfully",
      data: employee
    });
  } catch (err) {
    next(err);
  }
};

// 🔐 Get Employees by Access Rights
const getEmployeesByAccessRights = async (req, res, next) => {
  try {
    const { right } = req.query;
    
    let query = {};
    if (right) {
      query.accessRights = { $in: [right] };
    }
    
    const employees = await Employee.find(query);
    
    res.json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployeePassword,
  deleteEmployee,
  blockEmployee,
  getBlockedEmployees,
  updateEmployeeRights,
  getEmployeesByAccessRights
};
