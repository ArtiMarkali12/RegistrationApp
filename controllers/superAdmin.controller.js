const SuperAdmin = require("../models/superAdmin.model");
const bcrypt = require("bcryptjs");

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

module.exports = { createSuperAdmin, getAllSuperAdmins, getSuperAdminById, superAdminLogin };