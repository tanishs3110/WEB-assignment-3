/********************************************************************************
*  WEB322 – Assignment 03
*
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
*
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
*  Name: Tanish Soni   Student ID: _________   Date: ____________
*
********************************************************************************/

require("dotenv").config();
const express = require("express");
const path = require("path");
const clientSessions = require("client-sessions");

// DB setups
const connectMongo = require("./config/mongoose");
const sequelize = require("./config/sequelize");

// Routes
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

const app = express();

/* ----------------------------------------------------
   EJS SETUP
---------------------------------------------------- */
app.set("view engine", "ejs");

/* ----------------------------------------------------
   MIDDLEWARE
---------------------------------------------------- */
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');


app.use(
  clientSessions({
    cookieName: "session",
    secret: process.env.SESSION_SECRET,
    duration: 30 * 60 * 1000,
    activeDuration: 10 * 60 * 1000
  })
);

// Pass logged-in user to views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

/* ----------------------------------------------------
   ROUTES
---------------------------------------------------- */
app.get("/", (req, res) => res.render("home"));
app.use("/", authRoutes);
app.use("/", taskRoutes);

/* ----------------------------------------------------
   START SERVER (only after DBs connect)
---------------------------------------------------- */
connectMongo()
  .then(() => sequelize.authenticate())
  .then(() => {
    console.log("PostgreSQL connected");
    return sequelize.sync();
  })
  .then(() => {
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("Startup error:", err));