const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = "RESTAPI";

require("dotenv").config();

const User = require("../models/userModel");

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  console.log("name is ", name);
  const duplicate = await User.findOne({ email: email });
  //   console.log(duplicate);
  if (duplicate) return res.sendStatus(409);
  // return res.status(201).json({ message: "duplicate values found" });
  try {
    const hashedPwd = await bcrypt.hash(password, 10);
    const result = await User.create({
      name: name,
      email: email,
      password: hashedPwd,
    });
    const data = await User.findOne({ email: email });
    res.status(201).json({ status: "success", data: data });
  } catch (e) {
    res.send(500).json({ message: e.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  const foundUser = await User.findOne({ email: email });
  const match = await bcrypt.compare(password, foundUser.password);
  // console.log(match);
  if (match) {
    const accessToken = jwt.sign(
      {
        // name: foundUser.name,
        data: foundUser._id,
      },
      secret,
      { expiresIn: "1h" }
    );
    console.log(jwt.decode(accessToken, secret));
    res.status(200).json({ accessToken });
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;
