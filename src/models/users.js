const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Tasks = require("./tasks");

const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) throw new Error("Invalid email");
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 7,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error("Password should not consist of string 'password'.");
      }
    },
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

usersSchema.virtual("tasks", {
  ref: "tasks",
  localField: "_id",
  foreignField: "author",
});

usersSchema.pre("save", async function (next) {
  const user = this;
  const saltRounds = 8;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, saltRounds);
  }

  next();
});

usersSchema.pre("remove", async function (next) {
  const user = this;
  await Tasks.deleteMany({ author: user._id });
  next();
});

usersSchema.statics.findByCredentials = async function (email, password) {
  const user = await Users.findOne({ email });

  if (!user) {
    throw new Error("Unable to login");
  }
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to login");
  }

  return user;
};

usersSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "rogersismael");
  user.tokens = user.tokens.concat({ token });

  await user.save();
  return token;
};

usersSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

const Users = mongoose.model("users", usersSchema);

module.exports = Users;
