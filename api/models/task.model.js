import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  attendanceId: { type: mongoose.Schema.Types.ObjectId, ref: "Attendance" }, // link to attendance
  date: Date, // redundant but useful for quick queries
  task: { type: String, required: true }, // today's work description
  createdAt: { type: Date, default: Date.now },
});

const Task = mongoose.model("Task", taskSchema);
export default Task;
