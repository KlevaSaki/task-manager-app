const express = require("express");
const Tasks = require("../models/tasks");
const router = new express.Router();

router.post("/tasks", async (req, res) => {
  const task = new Tasks(req.body);

  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/tasks", async (req, res) => {
  try {
    const task = await Tasks.find({});
    res.status(200).send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/tasks/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Tasks.findById(_id);

    if (!task) {
      return res.status(404).send("No task with matching id found!");
    }

    res.status(200).send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch("/tasks/:id", async (req, res) => {
  const entries = ["header", "description", "completed"];
  const objectKeys = Object.keys(req.body);
  const acceptedEntries = objectKeys.every((key) => entries.includes(key));

  if (!acceptedEntries) {
    return res.status(400).send({ Error: "Invalid input" });
  }
  const _id = req.params.id;

  try {
    const task = await Tasks.findById(_id);

    objectKeys.forEach((key) => {
      task[key] = req.body[key];
    });

    await task.save();

    if (!task) {
      return res.status(404).send("No task with matching id found!");
    }

    res.status(201).send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/tasks/:id", async (req, res) => {
  try {
    const task = await Tasks.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).send("No task with matching id found!");
    }

    res.status(200).send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
