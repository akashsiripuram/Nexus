import express from "express";
import userRoutes from "./userRoutes.js";
import taskRoutes from "./taskRoutes.js";
import forumRoutes from "./forumRoutes.js";
import timesheetRoutes from "./timesheetRoutes.js";

const router = express.Router();

router.use("/user", userRoutes); //api/user/login
router.use("/task", taskRoutes);
router.use("/forum", forumRoutes);
router.use("/timesheet", timesheetRoutes);

export default router;
