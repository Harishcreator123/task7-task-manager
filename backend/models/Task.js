
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium"
    },

    status: {
      type: String,
      enum: ["To Do", "In Progress", "Completed"],
      default: "To Do"
    }
  },
  {
    timestamps: true
  }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
