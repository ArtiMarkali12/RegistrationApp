/**
 * Script to check if student references exist
 * 
 * Usage: node scripts/check-student-references.js
 */

require("dotenv").config();
const mongoose = require("mongoose");

async function checkStudentReferences() {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/registration-app";
    console.log("Connecting to MongoDB:", mongoUri);
    await mongoose.connect(mongoUri);
    console.log("✓ Connected to MongoDB\n");

    const db = mongoose.connection.db;
    const feesCollection = db.collection("fees");
    const studentsCollection = db.collection("students");

    // Get all fees
    const allFees = await feesCollection.find({}).toArray();
    console.log(`Total fees records: ${allFees.length}\n`);

    // Get all student IDs
    const allStudents = await studentsCollection.find({}).toArray();
    const studentIds = new Set(allStudents.map(s => s._id.toString()));
    console.log(`Total students in database: ${studentIds.size}\n`);

    // Check each fees record
    let missingCount = 0;
    let foundCount = 0;
    const missingStudents = new Set();

    console.log("📋 Checking student references...\n");

    for (const fee of allFees) {
      if (!fee.studentId) {
        console.log(`❌ Fees ${fee._id}: studentId is NULL in database`);
        missingCount++;
      } else {
        const studentIdStr = fee.studentId.toString();
        if (studentIds.has(studentIdStr)) {
          foundCount++;
        } else {
          missingStudents.add(studentIdStr);
          console.log(`⚠️  Fees ${fee._id}: studentId ${studentIdStr} NOT FOUND in students collection`);
          missingCount++;
        }
      }
    }

    console.log("\n" + "=".repeat(80));
    console.log("📊 Summary:");
    console.log(`   Fees with valid student reference: ${foundCount}`);
    console.log(`   Fees with missing/invalid student: ${missingCount}`);
    console.log(`   Unique missing student IDs: ${missingStudents.size}`);

    if (missingStudents.size > 0) {
      console.log("\n📋 Missing Student IDs:");
      missingStudents.forEach((id, i) => {
        console.log(`   ${i + 1}. ${id}`);
      });

      console.log("\n💡 Solution Options:");
      console.log("   1. Delete fees records with missing students");
      console.log("   2. Create dummy student records for these IDs");
      console.log("   3. Update fees to point to existing students");
    }

    await mongoose.disconnect();
    console.log("\n✓ Database disconnected");
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

checkStudentReferences();
