const express = require("express");
require("./db/mongoose");
const usersRouter = require("./router/users_router");
const tasksRouter = require("./router/tasks_router");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(usersRouter);
app.use(tasksRouter);

app.listen(port, () => {
  console.log("Server started on port: " + port);
});

// const Task = require("./models/tasks");
// const User = require("./models/users");

const main = async () => {
  // const task = await Task.findById("6033474c8e45e9175cb56d56");
  // await task.populate("author").execPopulate();
  // console.log(task.author);
  // const user = await User.findById("603347278e45e9175cb56d53");
  // await user.populate("tasks").execPopulate();
  // console.log(user.tasks);
};

// main();
