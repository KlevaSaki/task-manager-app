const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../../src/models/users");
const Task = require("../../src/models/tasks");

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: "lex",
  email: "lex@gmail.com",
  password: "lex2020",
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
    },
  ],
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  name: "mary",
  email: "mary@gmail.com",
  password: "mary2020",
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET),
    },
  ],
};

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  header: "first task",
  description: "set up task",
  completed: true,
  author: userOneId,
};

const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  header: "second task",
  description: "set up task",
  completed: false,
  author: userOneId,
};

const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  header: "third task",
  description: "set up task",
  completed: true,
  author: userTwoId,
};

const setUpDatabase = async () => {
  await User.deleteMany();
  await Task.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
};

module.exports = {
  userOneId,
  userOne,
  userTwo,
  userTwoId,
  taskOne,
  setUpDatabase,
};
