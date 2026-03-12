const Student = require("../models/student.model");

const getAllStudents = async () => {
  return await Student.find()
    .populate("eid", "fname lname")
    .populate("courseId", "name feesAmount duration");
};

const getStudentById = async (id) => {
  return await Student.findById(id)
    .populate("eid", "fname lname")
    .populate("courseId", "name feesAmount duration");
};

const getStudentByRegistrationNo = async (registration_no) => {
  return await Student.findOne({ registration_no })
    .populate("eid", "fname lname")
    .populate("courseId", "name feesAmount duration");
};

/* ================= GET STUDENT BY NAME (CASE-INSENSITIVE SEARCH) ================= */
const getStudentByName = async (name) => {
  // Case-insensitive regex search on fname, lname, or full name
  const regex = new RegExp(name, "i"); // "i" flag for case-insensitive
  
  return await Student.find({
    $or: [
      { fname: regex },
      { lname: regex },
      { mname: regex }
    ]
  })
    .populate("eid", "fname lname")
    .populate("courseId", "name feesAmount duration");
};

module.exports = {
  getAllStudents,
  getStudentById,
  getStudentByRegistrationNo,
  getStudentByName,
};