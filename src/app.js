const express = require("express");
require("./db/mongoose");
const usersRouter = require("./router/users_router");
const tasksRouter = require("./router/tasks_router");

const app = express();

app.use(express.json());
app.use(usersRouter);
app.use(tasksRouter);

module.exports = app;
