import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
  module: {
    type: String,
    required: true,
  }, // e.g. "Employee", "Task", "Leave", "Attendance"

  action: {
    type: String,
    required: true,
  }, // e.g. "add", "update", "delete", "approve"

  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // kisne action kiya

  targetModule: {
    type: String,
    required: true,
  }, // jis entity par action hua (safe instead of refPath)

  targetId: {
    type: mongoose.Schema.Types.ObjectId,
  }, // entity ka ObjectId (EmployeeId, TaskId, LeaveId, etc.)

  oldValue: {
    type: Object,
  }, // purana data (update/delete ke case me useful)

  newValue: {
    type: Object,
  }, // naya data (create/update ke case me useful)

  description: {
    type: String,
  }, // readable text (Admin approved leave for Harish)

  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// ✅ Indexes for fast searching
historySchema.index({ module: 1, action: 1, timestamp: -1 });
historySchema.index({ performedBy: 1, timestamp: -1 });

const History = mongoose.model("History", historySchema);
export default History;
