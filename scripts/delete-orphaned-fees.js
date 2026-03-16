/**
 * Script to DELETE fees records with null studentId
 * ⚠️ WARNING: This will permanently delete orphaned fees records!
 * 
 * Usage: node scripts/delete-orphaned-fees.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const Fees = require("../models/fees.model");

async function deleteOrphanedFees() {
  try {
    // Connect to database
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/registration-app";
    console.log("Connecting to MongoDB:", mongoUri);
    await mongoose.connect(mongoUri);
    console.log("✓ Connected to MongoDB\n");

    // Count orphaned fees records
    const orphanedFees = await Fees.find({ studentId: null });
    console.log(`⚠ Found ${orphanedFees.length} fees records with null studentId`);

    if (orphanedFees.length === 0) {
      console.log("✓ No orphaned fees records found!");
      await mongoose.disconnect();
      return;
    }

    // Display orphaned records
    console.log("\n📋 Orphaned fees records to be deleted:");
    orphanedFees.forEach((fee, index) => {
      console.log(`  ${index + 1}. Fees ID: ${fee._id}, Employee ID: ${fee.employeeId}, Amount: ₹${fee.totalAmount || fee.actualFees}, Status: ${fee.feesStatus}`);
    });

    // Confirm deletion
    console.log("\n⚠️  WARNING: This will PERMANENTLY DELETE these records!");
    console.log("Proceeding with deletion in 3 seconds...\n");
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Delete orphaned records
    const deleteResult = await Fees.deleteMany({ studentId: null });
    console.log(`✓ Successfully deleted ${deleteResult.deletedCount} orphaned fees records`);

    // Verify deletion
    const remainingOrphans = await Fees.countDocuments({ studentId: null });
    console.log(`✓ Remaining orphaned records: ${remainingOrphans}`);

    await mongoose.disconnect();
    console.log("\n✓ Database disconnected");
    console.log("\n✅ Done! Restart your server and test the API again.");
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

deleteOrphanedFees();
