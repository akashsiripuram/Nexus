import express from "express";
import { createProject, getProjects } from "../controllers/project.controller.js";
import verifyToken from "../middleware/verifyToken.js";

const router=express.Router();
router.post("/create",verifyToken,createProject);
router.get("/",verifyToken,getProjects)

export default router;