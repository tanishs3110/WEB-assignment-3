const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// REGISTER PAGE
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  // Check if email OR username is already used
  const existsUser = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (existsUser) {
    return res.render("register", {
      error: "Email or username already exists"
    });
  }

  // Hash password
  const hash = await bcrypt.hash(password, 10);

  // Create user
  const newUser = await User.create({
    username,
    email,
    password: hash
  });

  // Set session
  req.session.user = {
    id: newUser._id.toString(),
    username: newUser.username,
    email: newUser.email
  };

  res.redirect("/dashboard");
});


// LOGIN PAGE
router.get("/login", (req, res) => res.render("login", { error: null }));

// LOGIN POST
router.post("/login", async (req, res) => {
  const { email, password } = req.body;  // Changed from username to email

  const user = await User.findOne({ email });  // Query by email
  if (!user) return res.render("login", { error: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.render("login", { error: "Invalid credentials" });

  req.session.user = {
    id: user._id.toString(),
    username: user.username,
    email: user.email
  };

  res.redirect("/dashboard");
});

// LOGOUT
router.get("/logout", (req, res) => {
  req.session.reset();
  res.redirect("/login");
});

module.exports = router;