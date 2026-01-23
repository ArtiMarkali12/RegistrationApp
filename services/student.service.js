const Student = require("../models/student.model");


exports.create = (data) => Student.create(data);
exports.getAll = () => Student.find().populate("courseId deptId");