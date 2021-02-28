const express = require("express");
const Tasks = require("../models/tasks");
const auth = require("../middleware/auth");
const router = new express.Router();

router.post("/tasks", auth, async (req, res) => {
  const task = new Tasks({
    ...req.body,
    author: req.user._id,
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/tasks", auth, async (req, res) => {
  const match = {};
  const sort = {};

  if (req.query.completed) {
    match.completed = req.query.completed === "true"; //I love this statement. This dynamically sorts the returned data depending on the value the user
    //puts in the query string. This will set match.completed to a boolean value depending on whether the req.query.completed is true/false(meaning having the string true/false)
  }

  //Get /tasks?sortBy=createdAt:asc
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");

    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
    // This will return { sort : {createdAt: -1}}
  }

  try {
    // const task = await Tasks.find({ author: req.user._id }); Another way of populating the tasks route with its author Id.
    await req.user
      .populate({
        path: "tasks",
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort,
        },
      })
      .execPopulate();

    res.status(200).send(req.user.tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Tasks.findOne({ _id, author: req.user._id });

    if (!task) {
      return res.status(404).send("No task with matching id found!");
    }

    res.status(200).send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const entries = ["header", "description", "completed"];
  const objectKeys = Object.keys(req.body);
  const acceptedEntries = objectKeys.every((key) => entries.includes(key));

  if (!acceptedEntries) {
    return res.status(400).send({ Error: "Invalid input" });
  }
  const _id = req.params.id;

  try {
    const task = await Tasks.findOne({ _id, author: req.user._id });

    if (!task) {
      return res.status(404).send("No task with matching id found!");
    }

    objectKeys.forEach((key) => {
      task[key] = req.body[key];
    });

    await task.save();

    res.status(201).send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Tasks.findOneAndDelete({ _id, author: req.user._id });
    if (!task) {
      return res.status(404).send("No task with matching id found!");
    }

    res.status(200).send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
