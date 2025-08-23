import project from "../models/project.js";

export const createProject = async (req, res) => {
  const { name, description, githubRepo } = req.body;
  try {
    const project = new project({
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
