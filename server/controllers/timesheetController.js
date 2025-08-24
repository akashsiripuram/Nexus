import Timesheet from "../models/timesheet.js";
import User from "../models/user.js";
import Task from "../models/task.js";
import { transporter } from "../nodemailer.js";
import { generateTimesheetEmailTemplate } from "../utils/emailTemplates.js";

// Get week start and end dates
const getWeekDates = (date = new Date()) => {
  const start = new Date(date);
  start.setDate(start.getDate() - start.getDay()); // Start of week (Sunday)
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(start);
  end.setDate(end.getDate() + 6); // End of week (Saturday)
  end.setHours(23, 59, 59, 999);
  
  return { start, end };
};

// Simple auto-generate timesheet from tasks
export const autoGenerateTimesheet = async (req, res) => {
  try {
    const { userId } = req.params;
    const { weekStartDate } = req.body;

    const weekStart = new Date(weekStartDate);
    const { start, end } = getWeekDates(weekStart);

    // Get user's tasks for the week
    const tasks = await Task.find({
      createdBy: userId,
      date: { $gte: start, $lte: end },
      isTrashed: false
    }).populate('createdBy', 'name email');

    // Group tasks by date
    const tasksByDate = {};
    tasks.forEach(task => {
      const date = new Date(task.date).toDateString();
      if (!tasksByDate[date]) {
        tasksByDate[date] = [];
      }
      tasksByDate[date].push(task);
    });

    // Create simple timesheet entries
    const entries = [];
    const currentDate = new Date(start);
    
    while (currentDate <= end) {
      const dateStr = currentDate.toDateString();
      const dayTasks = tasksByDate[dateStr] || [];
      
      if (dayTasks.length > 0) {
        const activities = dayTasks.map(task => ({
          taskId: task._id,
          taskTitle: task.title,
          description: task.description || `Working on ${task.title}`,
          hours: 2 // Simple 2 hours per task
        }));

        entries.push({
          date: new Date(currentDate),
          startTime: '09:00',
          endTime: '17:00',
          hoursWorked: Math.min(dayTasks.length * 2, 8), // Cap at 8 hours
          activities,
          notes: `Worked on ${dayTasks.length} tasks`
        });
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Create or update timesheet
    let timesheet = await Timesheet.findOne({
      userId,
      weekStartDate: start,
      weekEndDate: end
    });

    if (timesheet) {
      timesheet.entries = entries;
      timesheet.totalHours = entries.reduce((total, entry) => total + (entry.hoursWorked || 0), 0);
    } else {
      timesheet = new Timesheet({
        userId,
        weekStartDate: start,
        weekEndDate: end,
        entries,
        totalHours: entries.reduce((total, entry) => total + (entry.hoursWorked || 0), 0),
        status: 'draft'
      });
    }

    await timesheet.save();
    await timesheet.populate('userId', 'name email');

    res.status(201).json({
      success: true,
      data: timesheet
    });
  } catch (error) {
    console.error('Error auto-generating timesheet:', error);
    res.status(500).json({
      success: false,
      message: 'Error auto-generating timesheet',
      error: error.message
    });
  }
};

// Get timesheet by week
export const getTimesheetByWeek = async (req, res) => {
  try {
    const { userId } = req.params;
    const { weekStartDate } = req.query;

    const weekStart = new Date(weekStartDate);
    const { start, end } = getWeekDates(weekStart);

    const timesheet = await Timesheet.findOne({
      userId,
      weekStartDate: start,
      weekEndDate: end
    }).populate('userId', 'name email');

    if (!timesheet) {
      return res.status(404).json({
        success: false,
        message: 'Timesheet not found for this week'
      });
    }

    res.status(200).json({
      success: true,
      data: timesheet
    });
  } catch (error) {
    console.error('Error getting timesheet:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting timesheet',
      error: error.message
    });
  }
};

// Send timesheet email
export const sendTimesheetEmail = async (req, res) => {
  try {
    const { timesheetId } = req.params;

    const timesheet = await Timesheet.findById(timesheetId)
      .populate('userId', 'name email');

    if (!timesheet) {
      return res.status(404).json({
        success: false,
        message: 'Timesheet not found'
      });
    }

    const weekRange = `${timesheet.weekStartDate.toLocaleDateString()} - ${timesheet.weekEndDate.toLocaleDateString()}`;
    const emailHtml = generateTimesheetEmailTemplate(timesheet.userId, timesheet, weekRange);

    const mailOptions = {
      from: process.env.smtp_user,
      to: timesheet.userId.email,
      subject: `Weekly Timesheet - ${weekRange}`,
      html: emailHtml
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: 'Timesheet email sent successfully'
    });
  } catch (error) {
    console.error('Error sending timesheet email:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending timesheet email',
      error: error.message
    });
  }
};
