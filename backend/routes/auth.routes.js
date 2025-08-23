import { createUser, getUser, loginUser } from "../controllers/user.controller.js";
import verifyToken from "../middleware/verifyToken.js";
import express from "express";

const router =express.Router();

router.post("/register", createUser);
router.post("/login",loginUser);
router.get("/get-user",verifyToken,getUser)
export default router;