const Employee = require("../models/employee.model");

const createEmployee = async (data) => {
  return await Employee.create(data);
};

const getAllEmployees = async () => {
  return await Employee.find();
};

module.exports = {
  createEmployee,
  getAllEmployees
};
