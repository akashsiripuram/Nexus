import mongoose, { Schema } from "mongoose";

const timesheetEntrySchema = new Schema({
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  hoursWorked: { type: Number, required: true },
  activities: [{
    taskId: { type: Schema.Types.ObjectId, ref: "Task" },
    taskTitle: { type: String },
    description: { type: String },
    hours: { type: Number, default: 0 }
  }],
  breaks: [{
    startTime: { type: String },
    endTime: { type: String },
    duration: { type: Number } // in minutes
  }],
  notes: { type: String }
});

const timesheetSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    weekStartDate: { type: Date, required: true },
    weekEndDate: { type: Date, required: true },
    entries: [timesheetEntrySchema],
    totalHours: { type: Number, default: 0 },
    status: {
      type: String,
      default: "draft",
      enum: ["draft", "submitted", "approved", "rejected"]
    },
    submittedAt: { type: Date },
    approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    approvedAt: { type: Date },
    comments: { type: String }
  },
  { timestamps: true }
);

// Index for efficient querying by user and week
timesheetSchema.index({ userId: 1, weekStartDate: 1 });

const Timesheet = mongoose.model("Timesheet", timesheetSchema);

export default Timesheet;
