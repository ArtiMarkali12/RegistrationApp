const SuperAdmin = require("../models/superAdmin.model");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const createSuperAdmin = async (req, res, next) => {
  try {
    const { name, email, mobileNo, password } = req.body;
    if (!name || !email || !mobileNo || !password) {
      return res.status(400).json({ success: false, message: "Name, email, mobile number and password are required" });
    }
    const existing = await SuperAdmin.findOne({ email });
    if (existing) return res.status(409).json({ success: false, message: "Super Admin already exists with this email" });
    const existingMobile = await SuperAdmin.findOne({ mobileNo });
    if (existingMobile) return res.status(409).json({ success: false, message: "Super Admin already exists with this mobile" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const superAdmin = await SuperAdmin.create({ name, email, mobileNo, password: hashedPassword });
    res.status(201).json({ success: true, message: "Super Admin created successfully", data: { _id: superAdmin._id, name: superAdmin.name, email: superAdmin.email, mobileNo: superAdmin.mobileNo, isActive: superAdmin.isActive } });
  } catch (err) { next(err); }
};

const getAllSuperAdmins = async (req, res, next) => {
  try {
    const superAdmins = await SuperAdmin.find().select("-password").populate("employees").populate("students");
    res.status(200).json({ success: true, count: superAdmins.length, data: superAdmins });
  } catch (err) { next(err); }
};

const getSuperAdminById = async (req, res, next) => {
  try {
    const superAdmin = await SuperAdmin.findById(req.params.id).select("-password").populate("employees").populate("students");
    if (!superAdmin) return res.status(404).json({ success: false, message: "Super Admin not found" });
    res.status(200).json({ success: true, data: superAdmin });
  } catch (err) { next(err); }
};

const superAdminLogin = async (req, res, next) => {
  try {
    const { email, mobileNo, password } = req.body;
    if ((!email && !mobileNo) || !password) return res.status(400).json({ success: false, message: "Email/Mobile and Password required" });
    const superAdmin = await SuperAdmin.findOne({ $or: [{ email }, { mobileNo }] });
    if (!superAdmin) return res.status(404).json({ success: false, message: "Super Admin not found" });
    if (!superAdmin.isActive) return res.status(403).json({ success: false, message: "Account deactivated" });
    const isMatch = await bcrypt.compare(password, superAdmin.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid Password" });
    res.status(200).json({ success: true, message: "Login Successful", data: { _id: superAdmin._id, name: superAdmin.name, email: superAdmin.email, mobileNo: superAdmin.mobileNo, employeesCount: superAdmin.employees.length, studentsCount: superAdmin.students.length } });
  } catch (err) { next(err); }
};

// 🔐 Forgot Password - Generate OTP
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const superAdmin = await SuperAdmin.findOne({ email });

    if (!superAdmin) {
      return res.status(404).json({
        success: false,
        message: "Super Admin not found with this email"
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Hash OTP before storing
    const hashedOtp = await bcrypt.hash(otp, 10);

    superAdmin.resetPasswordOtp = hashedOtp;
    superAdmin.resetPasswordOtpExpires = otpExpires;
    await superAdmin.save();

    // In production, send OTP via email/SMS
    // For now, return OTP in response (REMOVE IN PRODUCTION)
    res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email",
      otp: otp, // 🔴 REMOVE THIS IN PRODUCTION
      otpExpiresIn: "10 minutes"
    });
  } catch (err) {
    next(err);
  }
};

// 🔐 Verify OTP and Reset Password
const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;

    if (!email || !otp || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP, new password and confirm password are required"
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

    const superAdmin = await SuperAdmin.findOne({ email });

    if (!superAdmin) {
      return res.status(404).json({
        success: false,
        message: "Super Admin not found"
      });
    }

    // Check if OTP exists and is not expired
    if (!superAdmin.resetPasswordOtp || !superAdmin.resetPasswordOtpExpires) {
      return res.status(400).json({
        success: false,
        message: "No OTP request found. Please request a new OTP"
      });
    }

    if (superAdmin.resetPasswordOtpExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP"
      });
    }

    // Verify OTP
    const isOtpValid = await bcrypt.compare(otp, superAdmin.resetPasswordOtp);

    if (!isOtpValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    // Hash new password and update
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    superAdmin.password = hashedPassword;
    superAdmin.resetPasswordOtp = undefined;
    superAdmin.resetPasswordOtpExpires = undefined;
    await superAdmin.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully"
    });
  } catch (err) {
    next(err);
  }
};

// 🔐 Update Password (for logged-in user)
const updatePassword = async (req, res, next) => {
  try {
    const { superAdminId, oldPassword, newPassword, confirmPassword } = req.body;

    if (!superAdminId) {
      return res.status(400).json({
        success: false,
        message: "Super Admin ID is required"
      });
    }

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

    const superAdmin = await SuperAdmin.findById(superAdminId);

    if (!superAdmin) {
      return res.status(404).json({
        success: false,
        message: "Super Admin not found"
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, superAdmin.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Old password is incorrect"
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    superAdmin.password = hashedPassword;
    await superAdmin.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully"
    });
  } catch (err) {
    next(err);
  }
};

// 📋 Get All Employees under SuperAdmin
const getEmployeesUnderSuperAdmin = async (req, res, next) => {
  try {
    const { superAdminId } = req.params;

    const superAdmin = await SuperAdmin.findById(superAdminId)
      .populate({
        path: "employees",
        select: "-password",
        options: { sort: { fname: 1 } }
      });

    if (!superAdmin) {
      return res.status(404).json({
        success: false,
        message: "Super Admin not found"
      });
    }

    res.status(200).json({
      success: true,
      count: superAdmin.employees.length,
      data: superAdmin.employees
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { createSuperAdmin, getAllSuperAdmins, getSuperAdminById, superAdminLogin, forgotPassword, resetPassword, updatePassword, getEmployeesUnderSuperAdmin };