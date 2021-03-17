const request = require("supertest");
const app = require("../src/app");
const Task = require("../src/models/tasks");
const {
  userOneId,
  userOne,
  userTwo,
  userTwoId,
  taskOne,
  setUpDatabase,
} = require("./fixtures/db");
const mongoose = require("mongoose");

beforeEach(setUpDatabase);

// 1. Test create task
//2. Test  read task
//3. Test update task
//4. Test delete task

test("Should create task for user", async () => {
  const response = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      header: "From my test",
      description: "This is a test for created tasks",
    })
    .expect(201);

  const task = await Task.findById(response.body._id);
  expect(task).not.toBeNull();
  expect(task.completed).toEqual(false);
});

test("Should get users tasks", async () => {
  const response = await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  expect(response.body.length).toEqual(2);
});

test("Should fail to delete task from unauthorised user", async () => {
  const response = request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404);

  const task = await Task.findById(taskOne._id);
  expect(task).not.toBeNull();
});
