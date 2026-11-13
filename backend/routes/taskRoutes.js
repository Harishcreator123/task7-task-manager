
const express = require("express");
const Task = require("../models/Task");

const router = express.Router();

// Get all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error("FETCH TASK ERROR:", error);
    res.status(500).json({ message: "Unable to fetch tasks" });
  }
});

// Add a new task
router.post("/", async (req, res) => {
  try {
    const { title, priority } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Task title is required"
      });
    }

    const task = await Task.create({
      title: title.trim(),
      priority: priority || "Medium"
    });

    res.status(201).json(task);

  } catch (error) {
    console.error("CREATE TASK ERROR:", error);
    res.status(500).json({
      message: "Unable to create task"
    });
  }
});

// Update task status
router.put("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.json(task);

  } catch (error) {
    console.error("UPDATE TASK ERROR:", error);
    res.status(400).json({
      message: "Unable to update task"
    });
  }
});

// Delete a task
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.json({
      message: "Task deleted successfully"
    });

  } catch (error) {
    console.error("DELETE TASK ERROR:", error);
    res.status(400).json({
      message: "Unable to delete task"
    });
  }
});

module.exports = router;
