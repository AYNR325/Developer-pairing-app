const express = require("express");
const router = express.Router();
const taskController = require("../controllers/task-controller");
const { authMiddleware } = require("../controllers/auth/auth-controller");

// All routes are mounted at /api/task in server.js

// Create a task
router.post("/", authMiddleware, taskController.createTask);

// Update a task
router.put("/:id", authMiddleware, taskController.updateTask);

// Delete a task
router.delete("/:id", authMiddleware, taskController.deleteTask);

// Get all tasks for a sprint
router.get("/sprint/:id", authMiddleware, taskController.getAllTasks);

// Change task status
router.patch("/:id/status", authMiddleware, taskController.changeTaskStatus);

// Add a comment to a task
router.post("/:id/comments", authMiddleware, taskController.addComment);

// Remove a comment from a task
router.delete("/:taskId/comments/:commentId", authMiddleware, taskController.removeComment);

module.exports = router;
