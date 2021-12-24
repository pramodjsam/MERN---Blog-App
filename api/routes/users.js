const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Post = require("../models/Post");
const router = express.Router();

router.put("/:id", async (req, res) => {
  try {
    if (req.body.userId === req.params.id) {
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      }
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

      res.status(200).json(updatedUser);
    } else {
      return res.status(401).json({
        message: "You can only update your account ",
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    if (req.body.userId === req.params.id) {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "No user found" });
      }
      await Post.deleteMany({ username: user.username });
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json({
        success: true,
        message: "Account deleted successfully",
      });
    } else {
      res.status(401).json({
        message: "You can only delete your account",
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "No user found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
