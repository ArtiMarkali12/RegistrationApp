
const enquiryService = require("../services/enquiry.service");

const createEnquiry = async (req, res) => {
  try {
    const enquiry = await enquiryService.createEnquiry(req.body);

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
      data: enquiry,
    });
  } catch (error) {
    console.error("Enquiry Error:", error.message);

    // 🔴 validation / client error
    res.status(400).json({
      success: false,
      message: error.message || "Invalid enquiry data",
    });
  }
};

const getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await enquiryService.getAllEnquiries();

    res.status(200).json({
      success: true,
      data: enquiries,
    });
  } catch (error) {
    console.error("Get Enquiries Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch enquiries",
    });
  }
};

const getEnquiryByName = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Please provide a name to search",
      });
    }

    const enquiries = await enquiryService.getEnquiryByName(name.trim());

    if (enquiries.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No enquiries found with name "${name}"`,
      });
    }

    res.status(200).json({
      success: true,
      count: enquiries.length,
      data: enquiries,
    });
  } catch (error) {
    console.error("Get Enquiry By Name Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to search enquiries",
    });
  }
};

module.exports = {
  createEnquiry,
  getAllEnquiries,
  getEnquiryByName,
};