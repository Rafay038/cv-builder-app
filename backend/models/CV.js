const mongoose = require("mongoose");

const cvSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    fullName: String,
    jobTitle: String,
    email: String,
    phone: String,
    address: String,
    about: String,
    experience: String,
    education: String,
    skills: String,
    certifications: String,
    languages: String,
    templateStyle: String,
    accentColor: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("CV", cvSchema);