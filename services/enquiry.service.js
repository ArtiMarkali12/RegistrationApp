// const Enquiry = require("../models/enquiry.model");

// const createEnquiry = async (data) => {
//   return await Enquiry.create(data);
// };

// const getAllEnquiries = async () => {
//   return await Enquiry.find().populate("eid courseName");
// };

// module.exports = {
//   createEnquiry,
//   getAllEnquiries
// };



const Enquiry = require("../models/enquiry.model");
const mongoose = require("mongoose");

/* ================= GENERATE ENQUIRY NUMBER ================= */
const generateEnquiryNumber = () => {
  return "ENQ-" + Date.now();
};

/* ================= CREATE ENQUIRY ================= */
const createEnquiry = async (data) => {
  try {
    // 🔒 SAFE FIELD MAPPING (IMPORTANT)
    const fname = data.fname || data.firstName || "";
    const lname = data.lname || data.lastName || "";

    if (!fname || !lname) {
      throw new Error("First name and Last name are required");
    }

    const enquiryData = {
      fname,
      mname: data.mname || null,
      lname,

      contact: data.contact,
      email: data.email,
      address: data.address || null,

      qualification: data.qualification,
      requiredCourse: data.requiredCourse,
      requiredLocation: data.requiredLocation || null,

      gender: data.gender || null,
      reference: data.reference || null,
      testScore: data.testScore || null,

      enquiryNumber: generateEnquiryNumber(),

      // Validate ObjectIds safely
      eid: mongoose.Types.ObjectId.isValid(data.eid)
        ? data.eid
        : null,

      courseName: mongoose.Types.ObjectId.isValid(data.courseName)
        ? data.courseName
        : null,
    };

    return await Enquiry.create(enquiryData);
  } catch (error) {
    console.error("❌ Service Create Enquiry Error:", error.message);
    throw error;
  }
};

/* ================= GET ALL ENQUIRIES ================= */
const getAllEnquiries = async () => {
  try {
    const enquiries = await Enquiry.find()
      .populate("eid", "fname lname email") // Employee info
      .populate("courseName", "name feesAmount duration") // Course info
      .sort({ createdAt: -1 }); // Latest first

    return enquiries;
  } catch (error) {
    console.error("❌ Service Get All Enquiries Error:", error.message);
    throw error;
  }
};

module.exports = {
  createEnquiry,
  getAllEnquiries,
};