const express = require("express");
require("./db/mongoose");
const usersRouter = require("./router/users_router");
const tasksRouter = require("./router/tasks_router");

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(usersRouter);
app.use(tasksRouter);

app.listen(port, () => {
  console.log("Server started on port: " + port);
});
