const ReceiptCounter = require("../models/receiptCounter.model");

/* ================= GET NEXT RECEIPT NUMBER ================= */
const getNextReceiptNumber = async () => {
  try {
    // Find and increment counter atomically
    const counter = await ReceiptCounter.findOneAndUpdate(
      { _id: "receiptCounter" },
      { $inc: { sequenceNumber: 1 } },
      { new: true, upsert: true, new: true }
    );

    // Format receipt number: RCPT-000001, RCPT-000002, etc.
    const receiptNumber = `RCPT-${String(counter.sequenceNumber).padStart(6, '0')}`;
    
    return receiptNumber;
  } catch (error) {
    console.error("Get Next Receipt Number Error:", error);
    throw error;
  }
};

/* ================= GET CURRENT RECEIPT COUNT ================= */
const getCurrentReceiptCount = async () => {
  try {
    const counter = await ReceiptCounter.findById("receiptCounter");
    return counter ? counter.sequenceNumber : 0;
  } catch (error) {
    console.error("Get Current Receipt Count Error:", error);
    return 0;
  }
};

module.exports = {
  getNextReceiptNumber,
  getCurrentReceiptCount,
};
