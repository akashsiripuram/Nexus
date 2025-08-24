import express from "express";
import {
  createForum,
  getForums,
  getForumById,
  addComment,
  getComments,
  deleteForum,
} from "../controllers/forumController.js";
import { protectRoute } from "../middlewares/authMiddlewave.js";

const router = express.Router();

router.post("/create", protectRoute, createForum);
router.get("/", protectRoute, getForums);

router
  .route("/:id")
  .get(protectRoute, getForumById)
  .delete(protectRoute, deleteForum);


router
  .route("/:id/comments")
  .get(protectRoute, getComments)
  .post(protectRoute, addComment);

export default router;
