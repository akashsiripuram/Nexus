import Project from "../models/project.js";

export const createProject = async (req, res) => {
  const { name, description, githubRepo } = req.body;
  try {
    const project = new Project({
      name,
      description,
      githubRepo,
      owner: req.user.id,
    });
    await project.save();

    return res.status(200).json({
      success: true,
      message: "Project created Successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user.id });
    return res.status(200).json({
      success: true,
      projects,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const addMembers = async (req, res) => {
  const { members } = req.body;
  const { projectId } = req.params;
  try {
    const project = await Project.findById(projectId);
    project.members.push(...members);
    await project.save();
    return res.status(200).json({
      success: true,
      message: "Members added successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
