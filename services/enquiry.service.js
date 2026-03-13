
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

/* ================= GET ENQUIRY BY NAME (CASE-INSENSITIVE SEARCH) ================= */
const getEnquiryByName = async (name) => {
  const regex = new RegExp(name, "i");

  return await Enquiry.find({
    $or: [
      { fname: regex },
      { lname: regex },
      { mname: regex }
    ]
  })
    .populate("eid", "fname lname email")
    .populate("courseName", "name feesAmount duration")
    .sort({ createdAt: -1 });
};

/* ================= GET ENQUIRY BY ID ================= */
const getEnquiryById = async (id) => {
  try {
    return await Enquiry.findById(id)
      .populate("eid", "fname lname email")
      .populate("courseName", "name feesAmount duration");
  } catch (error) {
    console.error("❌ Service Get Enquiry By ID Error:", error.message);
    throw error;
  }
};

/* ================= UPDATE ENQUIRY ================= */
const updateEnquiry = async (id, data) => {
  try {
    const updateData = {};

    // Safe field mapping
    if (data.fname || data.firstName) {
      updateData.fname = data.fname || data.firstName;
    }
    if (data.lname || data.lastName) {
      updateData.lname = data.lname || data.lastName;
    }
    if (data.mname !== undefined) {
      updateData.mname = data.mname;
    }
    if (data.contact !== undefined) {
      updateData.contact = data.contact;
    }
    if (data.email !== undefined) {
      updateData.email = data.email;
    }
    if (data.address !== undefined) {
      updateData.address = data.address;
    }
    if (data.qualification !== undefined) {
      updateData.qualification = data.qualification;
    }
    if (data.requiredCourse !== undefined) {
      updateData.requiredCourse = data.requiredCourse;
    }
    if (data.requiredLocation !== undefined) {
      updateData.requiredLocation = data.requiredLocation;
    }
    if (data.gender !== undefined) {
      updateData.gender = data.gender;
    }
    if (data.reference !== undefined) {
      updateData.reference = data.reference;
    }
    if (data.testScore !== undefined) {
      updateData.testScore = data.testScore;
    }
    if (data.status !== undefined) {
      updateData.status = data.status;
    }

    // Validate ObjectIds safely
    if (data.eid && mongoose.Types.ObjectId.isValid(data.eid)) {
      updateData.eid = data.eid;
    }
    if (data.courseName && mongoose.Types.ObjectId.isValid(data.courseName)) {
      updateData.courseName = data.courseName;
    }

    return await Enquiry.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    })
      .populate("eid", "fname lname email")
      .populate("courseName", "name feesAmount duration");
  } catch (error) {
    console.error("❌ Service Update Enquiry Error:", error.message);
    throw error;
  }
};

/* ================= DELETE ENQUIRY ================= */
const deleteEnquiry = async (id) => {
  try {
    return await Enquiry.findByIdAndDelete(id);
  } catch (error) {
    console.error("❌ Service Delete Enquiry Error:", error.message);
    throw error;
  }
};

module.exports = {
  createEnquiry,
  getAllEnquiries,
  getEnquiryByName,
  getEnquiryById,
  updateEnquiry,
  deleteEnquiry,
};