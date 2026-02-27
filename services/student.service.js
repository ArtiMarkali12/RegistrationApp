// const Student = require("../models/student.model");


// exports.create = (data) => Student.create(data);
// exports.getAll = () => Student.find().populate("courseId deptId");





const Student = require("../models/student.model");

/* ================= GET ALL STUDENTS ================= */
const getAllStudents = async () => {
  return await Student.find()
    .populate("eid", "fname lname")
    .populate("courseId", "name feesAmount duration");
};

/* ================= GET STUDENT BY MONGODB _ID ================= */
const getStudentById = async (id) => {
  return await Student.findById(id)
    .populate("eid", "fname lname")
    .populate("courseId", "name feesAmount duration");
};

/* ================= GET STUDENT BY REGISTRATION NUMBER ================= */
const getStudentByRegistrationNo = async (registration_no) => {
  return await Student.findOne({ registration_no })
    .populate("eid", "fname lname")
    .populate("courseId", "name feesAmount duration");
};

module.exports = {
  getAllStudents,
  getStudentById,
  getStudentByRegistrationNo,
};