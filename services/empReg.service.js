const EmployeeReg = require("../models/empReg.model");

exports.createEmployee = async (data) => {
  const employee = new EmployeeReg(data);
  return await employee.save();
};

exports.getAllEmployees = async () => {
  return await EmployeeReg.find().populate("dept_id");
};