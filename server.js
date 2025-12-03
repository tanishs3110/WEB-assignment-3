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
const clientSessions = require("client-sessions");

const connectMongo = require("./config/mongoose");
const sequelize = require("./config/sequelize");

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

async function createServer() {
  const app = express();

  app.set("view engine", "ejs");

  app.use(express.urlencoded({ extended: true }));
  app.use(express.static("public"));
  app.use(express.static(__dirname + "/public"));
  app.set("views", __dirname + "/views");

  app.use(
    clientSessions({
      cookieName: "session",
      secret: process.env.SESSION_SECRET,
      duration: 30 * 60 * 1000,
      activeDuration: 10 * 60 * 1000,
    })
  );

  app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
  });

  // ROUTES
  app.get("/", (req, res) => res.render("home"));
  app.use("/", authRoutes);
  app.use("/", taskRoutes);

  // FORCE DB CONNECTIONS FIRST
  await connectMongo();
  await sequelize.authenticate();
  await sequelize.sync();

  console.log("All databases connected ✔");

  return app;
}

module.exports = createServer();
