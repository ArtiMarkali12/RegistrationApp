const Employee = require("../models/empReg.model");

exports.loginEmployee = async (email, mobileNo) => {
  return await Employee.findOne({
    $or: [{ email: email }, { mobileNo: mobileNo }],
  });
};

exports.findByEmail = async (email) => {
  return await Employee.findOne({ email });
};

exports.findByEmailOrMobile = async (email, mobileNo) => {
  return await Employee.findOne({
    $or: [{ email: email }, { mobileNo: mobileNo }],
  });
};

exports.findById = async (id) => {
  return await Employee.findById(id);
};

exports.saveOTP = async (employeeId, otp, otpExpires) => {
  return await Employee.findByIdAndUpdate(employeeId, {
    otp,
    otpExpires,
  });
};

exports.verifyOTP = async (employeeId, otp) => {
  const employee = await Employee.findById(employeeId);
  
  if (!employee || employee.otp !== otp || employee.otpExpires < Date.now()) {
    return null;
  }
  
  // Clear OTP after successful verification
  await Employee.findByIdAndUpdate(employeeId, {
    otp: undefined,
    otpExpires: undefined,
  });
  
  return employee;
};

exports.updatePassword = async (employeeId, hashedPassword) => {
  return await Employee.findByIdAndUpdate(employeeId, {
    password: hashedPassword,
    otp: undefined,
    otpExpires: undefined,
  });
};