import mongoose from "mongoose";

const forumSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      message: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Forum = mongoose.model("Forum", forumSchema);

export default Forum;
