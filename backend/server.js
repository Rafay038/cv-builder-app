const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", function (req, res) {
  res.send("Backend is running");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(function () {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 5000, function () {
      console.log("Server running on port 5000");
    });
  })
  .catch(function (error) {
    console.log("Database connection error", error);
  });