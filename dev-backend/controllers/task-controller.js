const Task = require("../models/Task");
const Sprint = require("../models/Sprint");

//create task
const createTask = async (req, res) => {
  const { sprintId, title, description, assignedTo } = req.body;
  try {
    if (!sprintId || !title || !description || !assignedTo) {
      return res.status(400).json({ message: "Required fields are missing" });
    }
    const task = await Task.create({
      sprint: sprintId,
      title,
      description,
      assignedTo,
    });
    // Optional: Add task to sprint's tasks array
    await Sprint.findByIdAndUpdate(sprintId, { $push: { tasks: task._id } });
    res.status(201).json({ task });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error" });
  }
};
//update task
const updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ task: updatedTask });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error" });
  }
};
//delete task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    // Optional: Remove from sprint's tasks array
    await Sprint.findByIdAndUpdate(task.sprint, { $pull: { tasks: task._id } });
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error" });
  }
};
//get all task
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ sprint: req.params.id }).populate(
      "assignedTo",
      "username"
    );
    res.status(200).json({ tasks });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error" });
  }
};
//change task status
const changeTaskStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const updatedStatus = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updatedStatus) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ task: updatedStatus });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error" });
  }
};

//add comment
const addComment = async (req, res) => {
  const { text } = req.body;
  const userId = req.user.id;
  try {
    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }
    const comment = {
      user: userId,
      text,
      timestamp: new Date(),
    };
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { $push: { comments: comment } },
      { new: true }
    ).populate("comments.user", "username");
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ task: updatedTask });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error" });
  }
};

//remove comment
const removeComment = async (req, res) => {
  const { taskId, commentId } = req.params;
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { $pull: { comments: { _id: commentId } } },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ message: "Task or comment not found" });
    }
    res.status(200).json({ task: updatedTask });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createTask,
  updateTask,
  deleteTask,
  getAllTasks,
  changeTaskStatus,
  addComment,
  removeComment,
};
