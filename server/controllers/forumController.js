import Forum from "../models/forum.js";

export const createForum = async (req, res) => {
  const { title, description, tags } = req.body;
  try {
    const userId = req.user.userId;
 
    const newForum = new Forum({
      title,
      description,
      createdBy: userId,
      tags,
    });
    await newForum.save();
    res.status(201).json({
      status: true,
      message: "Forum created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Error creating forum",
    });
  }
};

export const getForums = async (req, res) => {
  try {
    const forums = await Forum.find().sort({ createdAt: -1 });
    res.status(200).json({
      status: true,
      forums,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error fetching forums",
    });
  }
};

export const getForumById = async (req, res) => {
  const { id } = req.params;
  try {
    const forum = await Forum.findById(id);
    if (!forum) {
      return res.status(404).json({
        status: false,
        message: "Forum not found",
      });
    }
    res.status(200).json({
      status: true,
      forum,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error fetching forum",
    });
  }
};

export const addComment = async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;
  try {
    const forum = await Forum.findById(id);
    if (!forum) {
      return res.status(404).json({
        status: false,
        message: "Forum not found",
      });
    }
    forum.comments.push({
      user: req.userId,
      message,
    });
    await forum.save();
    res.status(200).json({
      status: true,
      message: "Comment added successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error adding comment",
    });
  }
};

export const getComments=async(req,res)=>{
    const {id}=req.params;
    try{
        const forum=await Forum.findById(id);
        if(!forum){
            return res.status(404).json({
                status:false,
                message:"Forum not found",
            })
        }
        res.status(200).json({
            status:true,
            comments:forum.comments,
        })
    }catch(error){
        res.status(500).json({
            status:false,
            message:"Error fetching comments",
        })
    }
}

export const deleteForum=async(req,res)=>{
    const {id}=req.params;
    try{
        const forum=await Forum.findById(id);
        if(!forum){
            return res.status(404).json({
                status:false,
                message:"Forum not found",
            })
        }
        if(forum.createdBy.toString()!==req.userId){
            return res.status(403).json({
                status:false,
                message:"You are not authorized to delete this forum",
            })
        }
        await forum.deleteOne();
        res.status(200).json({
            status:true,
            message:"Forum deleted successfully",
        })
    }catch(error){
        res.status(500).json({
            status:false,
            message:"Error deleting forum",
        })
    }
}