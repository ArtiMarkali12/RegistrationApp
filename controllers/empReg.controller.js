const empService = require("../services/empReg.service");
const bcrypt = require("bcryptjs");

/* 🔥 Create Employee */
exports.registerEmployee = async (req, res, next) => {
  try {
    const {
      fname,
      mname,
      lname,
      designation,
      dept_id,
      gender,
      qualification,
      email,
      mobileNo,
      password,
    } = req.body;

    // password hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = await empService.createEmployee({
      fname,
      mname,
      lname,
      designation,
      dept_id,
      gender,
      qualification,
      email,
      mobileNo,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "Employee Registered Successfully",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

/* 🔥 Get All Employees */
exports.getEmployees = async (req, res, next) => {
  try {
    const employees = await empService.getAllEmployees();
    res.status(200).json({
      success: true,
      data: employees,
    });
  } catch (error) {
    next(error);
  }
};