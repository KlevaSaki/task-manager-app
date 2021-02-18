const express = require("express");
const auth = require("../middleware/auth");
const Users = require("../models/users");

const router = new express.Router();

router.post("/users", async (req, res) => {
  try {
    const user = new Users(req.body);

    await user.save();
    const token = await user.generateAuthToken();

    res.status(201).send({ user, token });
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
    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.user.save();
    res.status(200).send("You are Logged Out!");
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];

    await req.user.save();
    res.status(200).send("Successful Logout");
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
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
