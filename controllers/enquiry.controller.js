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

const getEnquiryById = async (req, res) => {
  try {
    const { id } = req.params;

    const enquiry = await enquiryService.getEnquiryById(id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      data: enquiry,
    });
  } catch (error) {
    console.error("Get Enquiry By ID Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch enquiry",
    });
  }
};

const updateEnquiry = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedEnquiry = await enquiryService.updateEnquiry(id, req.body);

    if (!updatedEnquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Enquiry updated successfully",
      data: updatedEnquiry,
    });
  } catch (error) {
    console.error("Update Enquiry Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update enquiry",
    });
  }
};

const deleteEnquiry = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedEnquiry = await enquiryService.deleteEnquiry(id);

    if (!deletedEnquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Enquiry deleted successfully",
    });
  } catch (error) {
    console.error("Delete Enquiry Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to delete enquiry",
    });
  }
};

const getPendingEnquiriesBySuperAdmin = async (req, res) => {
  try {
    const { superAdminId } = req.params;

    if (!superAdminId) {
      return res.status(400).json({
        success: false,
        message: "SuperAdmin ID is required",
      });
    }

    const enquiries =
      await enquiryService.getPendingEnquiriesBySuperAdmin(superAdminId);

    res.status(200).json({
      success: true,
      count: enquiries.length,
      data: enquiries,
    });
  } catch (error) {
    console.error("Get Pending Enquiries By SuperAdmin Error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to fetch pending enquiries",
    });
  }
};

module.exports = {
  createEnquiry,
  getAllEnquiries,
  getEnquiryByName,
  getEnquiryById,
  updateEnquiry,
  deleteEnquiry,
  getPendingEnquiriesBySuperAdmin,
};
