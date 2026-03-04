const mongoose = require("mongoose");

const receiptCounterSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: "receiptCounter"
  },
  sequenceNumber: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model("ReceiptCounter", receiptCounterSchema);
