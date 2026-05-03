const express = require("express");
const CV = require("../models/CV");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/save", authMiddleware, async function (req, res) {
  try {
    const existingCV = await CV.findOne({ user: req.user.id });

    if (existingCV) {
      const updatedCV = await CV.findOneAndUpdate(
        { user: req.user.id },
        req.body,
        { new: true }
      );

      return res.json({
        message: "CV updated successfully",
        cv: updatedCV
      });
    }

    const newCV = await CV.create({
      user: req.user.id,
      ...req.body
    });

    return res.status(201).json({
      message: "CV saved successfully",
      cv: newCV
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/my-cv", authMiddleware, async function (req, res) {
  try {
    const cv = await CV.findOne({ user: req.user.id });

    if (!cv) {
      return res.status(404).json({ message: "No CV found" });
    }

    return res.json(cv);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;