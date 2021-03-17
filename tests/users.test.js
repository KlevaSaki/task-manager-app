const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/users");
const { userOneId, userOne, setUpDatabase } = require("./fixtures/db");

beforeEach(setUpDatabase);

test("Should sign up a new user", async () => {
  await request(app)
    .post("/users")
    .send({
      name: "Rogers",
      email: "rogerus22@gmail.com",
      password: "rogerus2020",
    })
    .expect(201);
});

test("Should login existing user", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(response.body.token).toBe(user.tokens[1].token);
});

test("Should fail nonexistent users", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: "linus22@gmail.com",
      password: "linus2020",
    })
    .expect(400);
});

test("Should get profile for user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should fail to get profile for unauthenticated user", async () => {
  await request(app).get("/users/me").send().expect(401);
});

test("Should delete account if authenticated", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user).toBeNull();
});

test("Should fail to delete account for unauthorised user", async () => {
  await request(app).delete("/users/me").send().expect(401);
});

test("Should upload user avatar image", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("avatar", "tests/fixtures/kobe.jpg")
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test("Should update valid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: "John Doe",
    })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.name).toBe("John Doe");
});

test("Should not update invalid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      location: "Nairobi",
    })
    .expect(400);
});
