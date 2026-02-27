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

/* 🔐 Forgot Password - Send OTP */
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email, mobileNo } = req.body;

    if (!email && !mobileNo) {
      return res.status(400).json({
        success: false,
        message: "Email or Mobile number is required",
      });
    }

    const employee = await loginService.findByEmailOrMobile(email, mobileNo);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found with this email or mobile number",
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await loginService.saveOTP(employee._id, otp, otpExpires);

    // TODO: Send OTP via email/SMS
    // For now, return OTP in response (remove in production)
    res.status(200).json({
      success: true,
      message: "OTP sent successfully to your registered contact",
      otp: otp, // Remove this in production
      data: {
        employeeId: employee._id,
        email: employee.email,
        mobileNo: employee.mobileNo,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* 🔐 Verify OTP */
exports.verifyOTP = async (req, res, next) => {
  try {
    const { employeeId, otp } = req.body;

    if (!employeeId || !otp) {
      return res.status(400).json({
        success: false,
        message: "Employee ID and OTP required",
      });
    }

    const employee = await loginService.verifyOTP(employeeId, otp);

    if (!employee) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      data: {
        employeeId: employee._id,
        email: employee.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* 🔐 Reset Password */
exports.resetPassword = async (req, res, next) => {
  try {
    const { employeeId, newPassword, confirmPassword } = req.body;

    if (!employeeId || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Employee ID, new password and confirm password required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const employee = await loginService.findById(employeeId);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await loginService.updatePassword(employeeId, hashedPassword);

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    next(error);
  }
};