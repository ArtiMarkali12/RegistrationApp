const Fees = require("../models/fees.model");


exports.add = (data) => {
data.pendingFees = data.totalFees - data.paidFees;
return Fees.create(data);
};