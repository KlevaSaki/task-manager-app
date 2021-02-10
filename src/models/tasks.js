const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  header: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const Tasks = mongoose.model("tasks", taskSchema);

module.exports = Tasks;
