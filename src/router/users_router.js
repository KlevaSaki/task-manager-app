const express = require("express");
const auth = require("../middleware/auth");
const sharp = require("sharp");
const Users = require("../models/users");
const multer = require("multer");
const { sendWelcomeEmail } = require("../emails/welcomeEmail");

const { sendDeleteAccMessage } = require("../emails/deleteAccEmail");

const router = new express.Router();

router.post("/users", async (req, res) => {
  try {
    const user = new Users(req.body);

    await user.save();
    sendWelcomeEmail(user.email, user.name);
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
    sendDeleteAccMessage(req.user.email, req.user.name);

    res.status(200).send(req.user);
  } catch (error) {
    res.status(500).send(error);
  }
});

//File uploads with Multer.
var upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("File format not supported!"));
    }

    cb(undefined, true);
  },
});

router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;

    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete("/users/me/avatar", auth, async (req, res) => {
  try {
    req.user.avatar = undefined;

    await req.user.save();
    res.send("Image deleted");
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await Users.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new Error();
    }
    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send(e);
  }
});

module.exports = router;
