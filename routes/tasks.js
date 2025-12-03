const express = require("express");
const Task = require("../models/Task");
const ensureLogin = require("../middleware/auth");

const router = express.Router();

// DASHBOARD
router.get("/dashboard", ensureLogin, (req, res) => {
  res.render("dashboard", { user: req.session.user });
});

// LIST TASKS
router.get("/tasks", ensureLogin, async (req, res) => {
  const tasks = await Task.findAll({ where: { userId: req.session.user.id } });
  res.render("tasks", { tasks });
});

// ADD PAGE
router.get("/tasks/add", ensureLogin, (req, res) => res.render("add"));

// ADD POST
router.post("/tasks/add", ensureLogin, async (req, res) => {
  await Task.create({
    title: req.body.title,
    description: req.body.description,
    dueDate: req.body.dueDate || null,
    userId: req.session.user.id
  });

  res.redirect("/tasks");
});

// EDIT PAGE
router.get("/tasks/edit/:id", ensureLogin, async (req, res) => {
  const task = await Task.findByPk(req.params.id);
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
  await Task.destroy({ where: { id: req.params.id, userId: req.session.user.id } });
  res.redirect("/tasks");
});

// STATUS UPDATE
router.post("/tasks/status/:id", ensureLogin, async (req, res) => {
  await Task.update(
    { status: req.body.status },
    { where: { id: req.params.id, userId: req.session.user.id } }
  );

  res.redirect("/tasks");
});

module.exports = router;
