const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Post = require("../models/postModel");
const secret = "RESTAPI";

router.use("/", (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    // console.log("token is here-->", token);
    try {
      jwt.verify(token, secret, async (err, decoded) => {
        if (err) {
          res.status(500).json({ status: "failed", message: err.message });
        }
        // console.log(decoded, err);
        req.user = decoded.data;
        next();
      });
    } catch (e) {
      console.log("err ", e);
    }
  } else {
    res
      .status(500)
      .json({ status: "failed", message: "Invalid token or token needed" });
  }
});

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user });
    res.json({
      status: "success",
      posts,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const post = await Post.create({
      title: req.body.title,
      body: req.body.body,
      image: req.body.image,
      user: req.user,
    });
    res.json({
      status: "success",
      post,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.put("/:postId", async (req, res) => {
  try {
    const post = await Post.findOne({
      _id: req.params.postId,
    });
    if (post.user == req.user && post._id == req.params.postId) {
      const updatePost = await Post.updateOne(
        { _id: req.params.postId },
        {
          title: req.body.title || post.title,
          body: req.body.body || post.body,
          image: req.body.image || post.image,
        }
      );
      res.json({
        status: "success",
        updatePost,
      });
    } else {
      res
        .status(401)
        .json({ message: "you are not authorized to edit other post" });
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.delete("/:postId", async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.postId });
    if (post.user == req.user && post._id == req.params.postId) {
      await Post.deleteOne({ _id: post._id });
      res.json({ status: "successfully deleted" });
    } else {
      res
        .status(401)
        .json({ message: "you are not authorized to delete other post" });
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
