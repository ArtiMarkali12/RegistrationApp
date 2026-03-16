/**
 * Script to delete fees records with missing student references
 * ⚠️ WARNING: This will PERMANENTLY DELETE orphaned fees records!
 * 
 * Usage: node scripts/cleanup-orphaned-fees.js
 */

require("dotenv").config();
const mongoose = require("mongoose");

async function cleanupOrphanedFees() {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/registration-app";
    console.log("Connecting to MongoDB:", mongoUri);
    await mongoose.connect(mongoUri);
    console.log("✓ Connected to MongoDB\n");

    const db = mongoose.connection.db;
    const feesCollection = db.collection("fees");
    const studentsCollection = db.collection("students");

    // Get all student IDs
    const allStudents = await studentsCollection.find({}).toArray();
    const studentIds = new Set(allStudents.map(s => s._id.toString()));
    console.log(`Total students in database: ${studentIds.size}`);

    // Get all fees
    const allFees = await feesCollection.find({}).toArray();
    console.log(`Total fees records: ${allFees.length}\n`);

    // Find orphaned fees
    const orphanedFeesIds = [];
    const orphanedFeesDetails = [];

    for (const fee of allFees) {
      if (!fee.studentId) {
        orphanedFeesIds.push(fee._id);
        orphanedFeesDetails.push({
          _id: fee._id,
          reason: "NULL studentId",
          amount: fee.totalAmount || fee.actualFees,
          receiptNumber: fee.receiptNumber
        });
      } else {
        const studentIdStr = fee.studentId.toString();
        if (!studentIds.has(studentIdStr)) {
          orphanedFeesIds.push(fee._id);
          orphanedFeesDetails.push({
            _id: fee._id,
            reason: "Student not found",
            studentId: studentIdStr,
            amount: fee.totalAmount || fee.actualFees,
            receiptNumber: fee.receiptNumber
          });
        }
      }
    }

    console.log(`⚠️  Found ${orphanedFeesIds.length} orphaned fees records\n`);

    if (orphanedFeesIds.length === 0) {
      console.log("✓ No orphaned fees records found!");
      await mongoose.disconnect();
      return;
    }

    // Display orphaned records
    console.log("📋 Orphaned fees records to be deleted:");
    console.log("=".repeat(80));
    orphanedFeesDetails.forEach((fee, index) => {
      console.log(`${index + 1}. [${fee.reason}] Fees ID: ${fee._id}`);
      console.log(`   Amount: ₹${fee.amount}, Receipt: ${fee.receiptNumber}`);
      if (fee.studentId) {
        console.log(`   Missing Student ID: ${fee.studentId}`);
      }
      console.log();
    });

    // Confirm deletion
    console.log("⚠️  WARNING: This will PERMANENTLY DELETE these records!");
    console.log("Proceeding with deletion in 5 seconds...\n");
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Delete orphaned records
    const deleteResult = await feesCollection.deleteMany({
      _id: { $in: orphanedFeesIds }
    });

    console.log("=".repeat(80));
    console.log(`✓ Successfully deleted ${deleteResult.deletedCount} orphaned fees records`);

    // Verify deletion
    const remainingFees = await feesCollection.countDocuments();
    console.log(`✓ Remaining fees records: ${remainingFees}`);

    await mongoose.disconnect();
    console.log("\n✓ Database disconnected");
    console.log("\n✅ Done! Restart your server and test the API again.");
    console.log("   All fees records should now have populated studentId!");
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

cleanupOrphanedFees();
