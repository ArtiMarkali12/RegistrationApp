const Employee = require("../models/employee.model");
const SuperAdmin = require("../models/superAdmin.model");
const bcrypt = require("bcryptjs");

const createEmployee = async (req, res) => {
  try {
    const { superAdminId } = req.body;

    // Validate superAdminId if provided
    if (superAdminId) {
      const superAdmin = await SuperAdmin.findById(superAdminId);
      if (!superAdmin) {
        return res.status(404).json({
          success: false,
          message: "Super Admin not found"
        });
      }

      const emp = await Employee.create(req.body);

      // Add employee to SuperAdmin's employees list
      await SuperAdmin.findByIdAndUpdate(superAdminId, {
        $push: { employees: emp._id }
      });

      return res.status(201).json({
        success: true,
        message: "Employee created successfully",
        data: emp
      });
    } else {
      // Create employee without linking to SuperAdmin (backward compatibility)
      const emp = await Employee.create(req.body);
      return res.status(201).json({
        success: true,
        message: "Employee created successfully",
        data: emp
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

const getAllEmployees = async (req, res) => {
  try {
    const emp = await Employee.find();
    return res.json({
      success: true,
      data: emp
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// 🔍 Get Employee by Employee ID (MongoDB _id)
const getEmployeeById = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    return res.json({
      success: true,
      data: employee
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// 🔐 Update Employee Password (using old password)
const updateEmployeePassword = async (req, res) => {
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

    const employee = await Employee.findById(employeeId);

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

    return res.json({
      success: true,
      message: "Password updated successfully"
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// 🗑️ Delete Employee
const deleteEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const deletedEmployee = await Employee.findByIdAndDelete(employeeId);

    if (!deletedEmployee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    return res.json({
      success: true,
      message: "Employee deleted successfully"
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// 🚫 Block Employee (PUT request)
const blockEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    employee.isBlocked = true;
    await employee.save();

    return res.json({
      success: true,
      message: "Employee blocked successfully",
      data: employee
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// 📋 Get All Blocked Employees
const getBlockedEmployees = async (req, res) => {
  try {
    const blockedEmployees = await Employee.find({ isBlocked: true });

    return res.json({
      success: true,
      count: blockedEmployees.length,
      data: blockedEmployees
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// ✅ Unblock Employee (PUT request)
const unblockEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    employee.isBlocked = false;
    await employee.save();

    return res.json({
      success: true,
      message: "Employee unblocked successfully",
      data: employee
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// 📋 Get All Unblocked Employees
const getUnblockedEmployees = async (req, res) => {
  try {
    const unblockedEmployees = await Employee.find({ isBlocked: false });

    return res.json({
      success: true,
      count: unblockedEmployees.length,
      data: unblockedEmployees
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// 🔍 Search Employees by Name or Email (Partial Match)
const searchEmployees = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Please provide a search query"
      });
    }

    const employees = await Employee.find({
      $or: [
        { fname: new RegExp(query, "i") },
        { lname: new RegExp(query, "i") },
        { email: new RegExp(query, "i") }
      ]
    })
      .populate("superAdminId", "fname lname email")
      .sort({ fname: 1 });

    if (employees.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No employees found matching "${query}"`
      });
    }

    return res.json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
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
  unblockEmployee,
  getUnblockedEmployees,
  searchEmployees
};
