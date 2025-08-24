import express from "express";
import {
  autoGenerateTimesheet,
  getTimesheetByWeek,
  sendTimesheetEmail
} from "../controllers/timesheetController.js";
import { protectRoute } from "../middlewares/authMiddlewave.js";

const router = express.Router();

// All routes are protected
router.use(protectRoute);

// Auto-generate timesheet from tasks
router.post("/:userId/auto-generate", autoGenerateTimesheet);

// Get timesheet by week
router.get("/:userId/week", getTimesheetByWeek);

// Send timesheet email
router.post("/:timesheetId/send-email", sendTimesheetEmail);

export default router;
