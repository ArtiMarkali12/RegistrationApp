/**
 * Script to check actual studentId values in fees collection
 * 
 * Usage: node scripts/check-fees-studentid.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const mongooseModule = require("mongoose");

async function checkFeesStudentId() {
  try {
    // Connect to database
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/registration-app";
    console.log("Connecting to MongoDB:", mongoUri);
    await mongoose.connect(mongoUri);
    console.log("✓ Connected to MongoDB\n");

    // Get native MongoDB collection
    const db = mongoose.connection.db;
    const feesCollection = db.collection("fees");

    // Get all fees records
    const allFees = await feesCollection.find({}).toArray();
    console.log(`Total fees records: ${allFees.length}\n`);

    // Check studentId values
    console.log("📋 Fees records studentId analysis:");
    console.log("=".repeat(80));
    
    let nullCount = 0;
    let validCount = 0;
    let invalidCount = 0;

    allFees.forEach((fee, index) => {
      const studentId = fee.studentId;
      const isValidObjectId = studentId && mongooseModule.Types.ObjectId.isValid(studentId);
      
      if (studentId === null || studentId === undefined) {
        nullCount++;
        console.log(`\n${index + 1}. [NULL] Fees ID: ${fee._id}`);
        console.log(`   Employee ID: ${fee.employeeId}`);
        console.log(`   Amount: ₹${fee.totalAmount || fee.actualFees}`);
        console.log(`   Status: ${fee.feesStatus}`);
        console.log(`   Receipt: ${fee.receiptNumber}`);
      } else if (isValidObjectId) {
        validCount++;
        console.log(`\n${index + 1}. [VALID] Fees ID: ${fee._id}`);
        console.log(`   Student ID: ${studentId}`);
        console.log(`   Employee ID: ${fee.employeeId}`);
      } else {
        invalidCount++;
        console.log(`\n${index + 1}. [INVALID] Fees ID: ${fee._id}`);
        console.log(`   Student ID: ${studentId} (Not a valid ObjectId)`);
        console.log(`   Employee ID: ${fee.employeeId}`);
      }
    });

    console.log("\n" + "=".repeat(80));
    console.log("📊 Summary:");
    console.log(`   Total records: ${allFees.length}`);
    console.log(`   Valid studentId: ${validCount}`);
    console.log(`   Null studentId: ${nullCount}`);
    console.log(`   Invalid studentId: ${invalidCount}`);

    // Check if there are students in the database
    const studentsCollection = db.collection("students");
    const studentCount = await studentsCollection.countDocuments();
    console.log(`\n📚 Total students in database: ${studentCount}`);

    if (studentCount > 0) {
      console.log("\n📋 Sample students:");
      const sampleStudents = await studentsCollection.find({}).limit(5).toArray();
      sampleStudents.forEach((student, index) => {
        console.log(`   ${index + 1}. ${student._id} - ${student.fname} ${student.lname} (${student.registration_no})`);
      });
    }

    await mongoose.disconnect();
    console.log("\n✓ Database disconnected");
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

checkFeesStudentId();
