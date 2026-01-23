const Employee = require("../models/employee.model");

const createEmployee = async (req, res, next) => {
  try {
    const emp = await Employee.create(req.body);
    res.status(201).json({
      success: true,
      data: emp
    });
  } catch (err) {
    next(err);
  }
};

const getAllEmployees = async (req, res, next) => {
  try {
    const emp = await Employee.find();
    res.json({
      success: true,
      data: emp
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createEmployee,
  getAllEmployees
};
