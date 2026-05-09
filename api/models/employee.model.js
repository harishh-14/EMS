import mongoose, { Schema } from "mongoose";
import User from "./user.model.js"
import Leave from "./leave.model.js"

const employeeSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  employeeId: { type: String, required: true, unique: true },
  doj: { type: Date },
  gender: { type: String },
  designation: { type: String },
  department: {
    type: Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
});

// ✅ Cascade delete User + Leave
employeeSchema.pre(["findOneAndDelete", "deleteOne"], async function (next) {
  try {
    const empId = this.getQuery()._id;
    const emp = await mongoose.model("Employee").findById(empId);

    if (emp) {
      // User delete
      if (emp.userId) {
        await User.findByIdAndDelete(emp.userId);
      }
      // Leaves delete
      await Leave.deleteMany({ employeeId: emp._id });
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;
