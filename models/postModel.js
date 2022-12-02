const User = require("../models/userModel");
const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },

  user: {
    ref: "users",
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});
const postModel = mongoose.model("Post", postSchema);

module.exports = postModel;
