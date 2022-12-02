const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const user = require("./routes/users");
const post = require("./routes/posts");

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/users", (err) => {
  if (err) console.log(err);
  else console.log("connected");
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use("/users", user);
app.use("/posts", post);

const PORT = 3000;

app.listen(PORT, () => {
  console.log("app is listening on ", PORT);
});
