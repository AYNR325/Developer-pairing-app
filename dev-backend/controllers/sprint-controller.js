const Sprint = require("../models/Sprint");
const User = require("../models/User");

//create a sprint
const createSprint = async (req, res) => {
  const {
    title,
    description,
    techStack,
    duration,
    startDate,
    creator,
    maxTeamSize,
  } = req.body;
console.log(req.body);
  // Validate required fields
  if (
    !title ||
    !description ||
    !techStack ||
    !duration ||
    !startDate ||
    !creator ||
    !maxTeamSize
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if creator exists
    const creatorUser = await User.findById(creator);
    if (!creatorUser) {
      return res.status(404).json({ message: "Creator not found" });
    }

    // (Optional) Check for unique title
    // const existingSprint = await Sprint.findOne({ title });
    // if (existingSprint) {
    //     return res.status(400).json({ message: "Sprint with this title already exists" });
    // }

    // Calculate endDate based on startDate and duration
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + Number(duration));

    // Create the sprint
    const sprint = await Sprint.create({
      title,
      description,
      techStack,
      duration,
      startDate: start,
      endDate: end,
      creator,
      teamMembers: [creator],
      maxTeamSize,
    });

    // (Optional) Add sprint to creator's sprints array if it exists in User model
    if (creatorUser.sprints) {
      creatorUser.sprints.push(sprint._id);
      await creatorUser.save();
    }

    // Return only the sprint ID for redirect
    res.status(201).json({ sprintId: sprint._id });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error" });
  }
};

//join a sprint
const joinSprint = async (req, res) => {
  // Get sprintId from params and userId from body (or req.user if using auth)
  const sprintId = req.params.id || req.body.sprintId;
  const userId = req.user.id; // Preferably from req.user._id if using auth

  try {
    // 1. Find sprint
    const sprint = await Sprint.findById(sprintId);
    if (!sprint) {
      return res.status(404).json({ message: "Sprint not found" });
    }

    // 2. Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3. Check if sprint is full
    if (sprint.teamMembers.length >= sprint.maxTeamSize) {
      // (Optional) Suggest other open sprints here
      return res.status(400).json({ message: "Sprint is full" });
    }

    // 4. Check if sprint has started (current date >= startDate)
    const now = new Date();
    if (now >= sprint.startDate) {
      return res.status(400).json({ message: "Sprint has already started" });
    }

    // 5. Check if sprint is finished
    if (sprint.isFinished) {
      return res.status(400).json({ message: "Sprint is already finished" });
    }

    // 6. Check if user is already in the sprint
    if (
      sprint.teamMembers.some(
        (memberId) => memberId.toString() === userId.toString()
      )
    ) {
      return res.status(400).json({ message: "User is already in the sprint" });
    }

    // 7. Add user to teamMembers
    sprint.teamMembers.push(userId);
    await sprint.save();

    // 8. (Optional) Add sprint to user's sprints array if it exists
    if (user.sprints) {
      user.sprints.push(sprint._id);
      await user.save();
    }

    res.status(200).json({ message: "User joined the sprint successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error" });
  }
};

//get all sprints
const getAllSprints = async (req, res) => {
  try {
    const sprints = await Sprint.find();
    res.status(200).json({ sprints });
    console.log(sprints);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error" });
  }
};

//get a sprint by id
//get sprint info for sprint room
const getSprintById = async (req, res) => {
  const sprintId = req.params.id;
  try {
    const sprint = await Sprint.findById(sprintId);
    if (!sprint) {
      return res.status(404).json({ message: "sprint not found" });
    }
    res.status(200).json({ sprint });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error" });
  }
};

//update a sprint
const updateSprint = async (req, res) => {
  const sprintId = req.params.id;
  const userId = req.user.id; // Should come from auth in a real app
  const updateData = req.body;
  try {
    const sprint = await Sprint.findById(sprintId);
    if (!sprint) {
      return res.status(404).json({ message: "Sprint not found" });
    }
    if (sprint.creator.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Only the creator can update this sprint" });
    }
    const updatedSprint = await Sprint.findByIdAndUpdate(sprintId, updateData, {
      new: true,
    });
    res.status(200).json({ sprint: updatedSprint });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error" });
  }
};

//delete a sprint
const deleteSprint = async (req, res) => {
  const sprintId = req.params.id;
  const userId = req.user.id;
  try {
    const sprint = await Sprint.findById(sprintId);
    if (!sprint) {
      return res.status(404).json({ message: "Sprint not found" });
    }
    if (sprint.creator.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Only the creator can delete this sprint" });
    }
    await Sprint.findByIdAndDelete(sprintId);
    res.status(200).json({ message: "sprint deleted successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error" });
  }
};

//sprint-room resources
const getSprintResources = async (req, res) => {
  const sprintId = req.params.id;
  try {
    const sprint = await Sprint.findById(sprintId, "resources");
    if (!sprint) {
      return res.status(404).json({ message: "Sprint not found" });
    }
    res.status(200).json({ resources: sprint.resources });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error" });
  }
};

//sprint-room  update resources
const updateSprintResources = async (req, res) => {
  const sprintId = req.params.id;
  const userId = req.user.id;
  const resources = req.body; // Should be an object with githubRepo, demoLink, extraLinks, etc.
  try {
    const sprint = await Sprint.findById(sprintId);
    if (!sprint) {
      return res.status(404).json({ message: "Sprint not found" });
    }
    if (sprint.creator.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Only the creator can update resources" });
    }
    sprint.resources = { ...sprint.resources, ...resources };
    await sprint.save();
    res.status(200).json({ resources: sprint.resources });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error" });
  }
};

//mark sprint as finished
const finishSprint = async (req, res) => {
    const sprintId = req.params.id;
    const userId = req.user.id;
    try {
        const sprint = await Sprint.findById(sprintId);
        if (!sprint) {
            return res.status(404).json({ message: "Sprint not found" });
        }
        if (sprint.creator.toString() !== userId) {
            return res.status(403).json({ message: "Only the creator can finish the sprint" });
        }
        sprint.isFinished = true;
        await sprint.save();
        res.status(200).json({ sprint });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
  createSprint,
  joinSprint,
  getAllSprints,
  getSprintById,
  updateSprint,
  deleteSprint,
  getSprintResources,
  updateSprintResources,
  finishSprint
};
