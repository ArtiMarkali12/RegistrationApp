const Employee = require("../models/empReg.model");

exports.loginEmployee = async (email, mobileNo) => {
  return await Employee.findOne({
    $or: [{ email: email }, { mobileNo: mobileNo }],
  });
};