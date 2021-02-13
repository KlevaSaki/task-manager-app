const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

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
});

usersSchema.pre("save", async function (next) {
  const user = this;
  const saltRounds = 8;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, saltRounds);
  }

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

const Users = mongoose.model("users", usersSchema);

module.exports = Users;
