require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error.middleware");


const app = express();

// 🔌 DB connect
connectDB();

// 🔥 Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🚏 Routes
app.use("/api/enquiries", require("./routes/enquiry.routes"));
app.use("/api/registration", require("./routes/student.routes"));
app.use("/api/fees", require("./routes/fees.routes"));
app.use("/api/employees", require("./routes/employee.routes"));
app.use("/api/courses", require("./routes/course.routes"));
app.use("/api/technologies", require("./routes/technology.routes")); // ✅ NEW
app.use("/api/courseTechs", require("./routes/courseTech.routes"));



// ❗ Error handler (ALWAYS LAST)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
