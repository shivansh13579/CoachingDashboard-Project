const express = require("express");
const dotenv = require("dotenv");
const adminRouter = require("./routers/adminRoutes");
const batchRouter = require("./routers/batchRoutes");
const studentRouter = require("./routers/studentRoutes");
const studentFeesRouter = require("./routers/studentFeesRoutes");
const cors = require("cors");

const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());

app.use("/api/v1/admins", adminRouter);
app.use("/api/v1/batches", batchRouter);
app.use("/api/v1/students", studentRouter);
app.use("/api/v1/studentFees", studentFeesRouter);

module.exports = app;
