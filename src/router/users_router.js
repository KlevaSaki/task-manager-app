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
    res.status(400).send("No user found! Sign up for an account.");
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

router.patch("/users/me", auth, async (req, res) => {
  const entries = ["name", "email", "password", "_id"];
  const objectKeys = Object.keys(req.body);

  const allowedEntries = objectKeys.every((key) => entries.includes(key));

  if (!allowedEntries) {
    return res.status(400).send({ error: "Invalid entry" });
  }

  try {
    const user = req.user; //an object with user details like name, password, id

    objectKeys.forEach((key) => {
      user[key] = req.body[key]; //this code dynamically sets the user value to the req body value the user wishes to update
      //the user could decide to update any of the values(name, email address, password), and we tap into that
      //with bracket notation and setting it dynamically with the value the user has chosen to update from the req.body
    });

    await user.save();

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();

    res.status(200).send(req.user);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
