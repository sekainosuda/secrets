require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption");
const md5 = require("md5");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

const keys = require(__dirname + "/keys");

mongoose.connect(
  keys.MongodbLocalURI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  err => {
    if (err) throw err;
    console.log("MongoDB Connected...");
  }
);

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

// // mongoose-encryption
// userSchema.plugin(encrypt, {
//   secret: process.env.SECRET,
//   encryptedFields: ["password"]
// });

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: md5(req.body.password)
  });
  newUser.save((err, savedUser) => {
    res.redirect("/secrets");
  });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  User.findOne({ email: req.body.username }, (err, foundUser) => {
    if (err) throw err;
    if (foundUser) {
      if (md5(req.body.password) === foundUser.password) {
        return res.redirect("/secrets");
      } else {
        return res.redirect("/login");
      }
    }
  });
});

app.get("/secrets", (req, res) => {
  res.render("secrets");
});

app.get("/submit", (req, res) => {
  res.render("submit");
});

const port = 3000;
app.listen(port, console.log(`Server started on port ${port}`));
