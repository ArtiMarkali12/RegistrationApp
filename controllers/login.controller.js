const loginService = require("../services/login.service");
const bcrypt = require("bcryptjs");

exports.login = async (req, res, next) => {
  try {
    const { email, mobileNo, password } = req.body;

    if ((!email && !mobileNo) || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/Mobile and Password required",
      });
    }

    const employee = await loginService.loginEmployee(email, mobileNo);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const isMatch = await bcrypt.compare(password, employee.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }

    res.status(200).json({
      success: true,
      message: "Login Successful",
      data: {
        _id: employee._id,
        fname: employee.fname,
        lname: employee.lname,
        email: employee.email,
        designation: employee.designation,
      },
    });
  } catch (error) {
    next(error);
  }
};