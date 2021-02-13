const express = require("express");
const Users = require("../models/users");

const router = new express.Router();

router.post("/users", async (req, res) => {
  const user = new Users(req.body);

  try {
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await Users.findByCredentials(
      req.body.email,
      req.body.password
    );

    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await Users.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/users/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await Users.findById(_id);

    if (!user) {
      return res.status(404).send("No match found for the user id!");
    }

    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch("/users/:id", async (req, res) => {
  const entries = ["name", "email", "password", "_id"];
  const objectKeys = Object.keys(req.body);

  const allowedEntries = objectKeys.every((key) => entries.includes(key));

  if (!allowedEntries) {
    return res.status(400).send({ error: "Invalid entry" });
  }

  try {
    const _id = req.params.id;
    const user = await Users.findById(_id);

    objectKeys.forEach((key) => {
      user[key] = req.body[key];
    });

    await user.save();

    if (!user) {
      return res.status(404).send("No user with matching id found!");
    }

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    const user = await Users.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send("No user with matching id found!");
    }

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
