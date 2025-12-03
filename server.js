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
const serverless = require("serverless-http");

// DB setups
const connectMongo = require("./config/mongoose");
const sequelize = require("./config/sequelize");

// Routes
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

const app = express();

/* EJS SETUP */
app.set("view engine", "ejs");

/* MIDDLEWARE */
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/public", express.static(path.join(__dirname, "public")));

app.use(
  clientSessions({
    cookieName: "session",
    secret: process.env.SESSION_SECRET,
    duration: 30 * 60 * 1000,
    activeDuration: 10 * 60 * 1000
  })
);

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

/* ROUTES */
app.get("/", (req, res) => res.render("home"));
app.use("/", authRoutes);
app.use("/", taskRoutes);

/* DATABASE INIT (lazy) */
let ready = false;
async function init() {
  if (ready) return;
  await connectMongo();
  await sequelize.authenticate();
  await sequelize.sync();
  ready = true;
}

// ensure DBs connect before each request
app.use(async (req, res, next) => {
  await init();
  next();
});

/* EXPORT FOR VERCEL */
module.exports = serverless(app);
const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
