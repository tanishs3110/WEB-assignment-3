const express = require("express");
const Task = require("../models/Task");
const ensureLogin = require("../middleware/auth");

const router = express.Router();

// DASHBOARD
router.get("/dashboard", ensureLogin, (req, res) => {
  res.render("dashboard", { user: req.session.user });
});

// VIEW ALL TASKS
router.get("/tasks", ensureLogin, async (req, res) => {
  let tasks = await Task.findAll({
    where: { userId: req.session.user.id }
  });

  // FIX: convert Sequelize models → plain objects
  tasks = tasks.map(t => t.get({ plain: true }));

  res.render("tasks", { tasks });
});

// ADD TASK PAGE
router.get("/tasks/add", ensureLogin, (req, res) => {
  res.render("add");
});

// ADD TASK POST
router.post("/tasks/add", ensureLogin, async (req, res) => {
  const { title, description, dueDate } = req.body;

  await Task.create({
    title,
    description,
    dueDate,
    status: "pending",
    userId: req.session.user.id
  });

  res.redirect("/tasks");
});

// EDIT TASK PAGE
router.get("/tasks/edit/:id", ensureLogin, async (req, res) => {
  let task = await Task.findOne({
    where: { id: req.params.id, userId: req.session.user.id }
  });

  if (!task) return res.redirect("/tasks");

  // FIX
  task = task.get({ plain: true });

  res.render("editTask", { task });
});

// EDIT POST
router.post("/tasks/edit/:id", ensureLogin, async (req, res) => {
  await Task.update(
    {
      title: req.body.title,
      description: req.body.description,
      dueDate: req.body.dueDate,
      status: req.body.status
    },
    { where: { id: req.params.id, userId: req.session.user.id } }
  );

  res.redirect("/tasks");
});

// DELETE
router.post("/tasks/delete/:id", ensureLogin, async (req, res) => {
  await Task.destroy({
    where: { id: req.params.id, userId: req.session.user.id }
  });

  res.redirect("/tasks");
});

// STATUS UPDATE
router.post("/tasks/status/:id", ensureLogin, async (req, res) => {
  const newStatus =
    req.body.status === "completed" ? "completed" : "pending";

  await Task.update(
    { status: newStatus },
    { where: { id: req.params.id, userId: req.session.user.id } }
  );

  res.redirect("/tasks");
});

module.exports = router;
