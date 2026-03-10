require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error.middleware");
const cors = require("cors");

const app = express();

/* 🔌 DB connect */
connectDB();

/* 🔥 Middleware */
app.use(cors()); // ✅ VERY IMPORTANT for frontend
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ✅ ROOT ROUTE (FIX FOR Cannot GET /) */
app.get("/", (req, res) => {
  res.status(200).send("Orange ITech Backend is running 🚀");
});

/* 🚏 API Routes */
app.use("/api/enquiries", require("./routes/enquiry.routes"));
app.use("/api/registration", require("./routes/student.routes"));
app.use("/api/fees", require("./routes/fees.routes"));
app.use("/api/employees", require("./routes/employee.routes"));
app.use("/api/courses", require("./routes/course.routes"));
app.use("/api/technologies", require("./routes/technology.routes"));
app.use("/api/courseTechs", require("./routes/courseTech.routes"));
app.use("/api/departments", require("./routes/department.routes"));
app.use("/api/empReg", require("./routes/empReg.routes"));

app.use("/api/login", require("./routes/login.routes"));
app.use("/api/notifications", require("./routes/notification.routes"));
app.use("/api/super-admin", require("./routes/superAdmin.routes"));

/* ❗ Error handler (ALWAYS LAST) */
app.use(errorHandler);

/* 🚀 Server */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  
});
