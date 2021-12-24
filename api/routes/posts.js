const express = require("express");
const Post = require("../models/Post");
const fs = require("fs");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const post = new Post(req.body);
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

      res.status(200).json({
        updatedPost,
      });
    } else {
      return res.status(401).json({
        message: "You can update only your post",
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
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "No post found" });
    }
    if (post.username === req.body.username) {
      if (post.photo) {
        fs.unlinkSync(`./api/images/${post.photo}`);
      }
      await post.delete();
      res.status(200).json({
        message: "Post deleted successfully",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "You can update only your post",
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
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "No post found" });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const username = req.query.user;
    const catName = req.query.cat;
    let posts;
    if (username) {
      posts = await Post.find({ username });
    } else if (catName) {
      posts = await Post.find({
        categories: {
          $in: [catName],
        },
      });
    } else {
      posts = await Post.find({});
    }
    res.status(200).json(posts);
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
