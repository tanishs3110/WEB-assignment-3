const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// REGISTER PAGE
router.get("/register", (req, res) => {
  res.render("register");
});

// REGISTER POST
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.render("register", { error: "All fields required" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.render("register", { error: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email,
      password: hashed
    });

    res.redirect("/login");
  } catch (err) {
    res.render("register", { error: "Registration error" });
  }
});

// LOGIN PAGE
router.get("/login", (req, res) => {
  res.render("login");
});

// LOGIN POST
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.render("login", { error: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match)
    return res.render("login", { error: "Invalid credentials" });

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
