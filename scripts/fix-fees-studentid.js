/**
 * Script to fix fees records with null studentId
 * Run this script to clean up orphaned fees records
 *
 * Usage: node scripts/fix-fees-studentid.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const Fees = require("../models/fees.model");
const Student = require("../models/student.model");

async function fixFeesStudentId() {
  try {
    // Connect to database
    const mongoUri =
      process.env.MONGO_URI || "mongodb://localhost:27017/registration-app";
    console.log("Connecting to MongoDB:", mongoUri);
    await mongoose.connect(mongoUri);
    console.log("✓ Connected to MongoDB");

    // Find all fees records with null studentId
    const orphanedFees = await Fees.find({ studentId: null });
    console.log(
      `\n⚠ Found ${orphanedFees.length} fees records with null studentId`,
    );

    if (orphanedFees.length === 0) {
      console.log(
        "✓ No orphaned fees records found. All fees are properly linked!",
      );
      await mongoose.disconnect();
      return;
    }

    // Option 1: Delete orphaned records (uncomment to enable)
    // console.log("\n🗑 Deleting orphaned fees records...");
    // const deleteResult = await Fees.deleteMany({ studentId: null });
    // console.log(`✓ Deleted ${deleteResult.deletedCount} orphaned fees records`);

    // Option 2: Try to match by employeeId or other criteria (customize as needed)
    // For example, if you have students with matching employeeId or contact info
    console.log("\n📋 Orphaned fees records:");
    orphanedFees.forEach((fee, index) => {
      console.log(
        `  ${index + 1}. Fees ID: ${fee._id}, Employee ID: ${fee.employeeId}, Amount: ₹${fee.totalAmount}`,
      );
    });

    // Option 3: Update with a specific studentId if you know which student owns these fees
    // Example: Update all orphaned fees to a specific student
    // const defaultStudentId = "YOUR_STUDENT_ID_HERE";
    // const updateResult = await Fees.updateMany(
    //   { studentId: null },
    //   { $set: { studentId: defaultStudentId } }
    // );
    // console.log(`✓ Updated ${updateResult.modifiedCount} records`);

    console.log("\n💡 Manual action required:");
    console.log(
      "   These fees records need to be manually linked to students.",
    );
    console.log("   You can either:");
    console.log("   1. Delete them if they're test/invalid records");
    console.log("   2. Update them manually with the correct studentId");
    console.log(
      "   3. Modify this script to auto-match based on your business logic",
    );

    await mongoose.disconnect();
    console.log("\n✓ Database disconnected");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

fixFeesStudentId();
