const express = require("express");
const Category = require("../models/Category");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const category = new Category(req.body);
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json({
      error: error.message,
      success: false,
    });
  }
});

module.exports = router;
