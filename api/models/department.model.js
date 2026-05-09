import mongoose from "mongoose";
import Employee from "./employee.model.js";
import Leave from "./leave.model.js";

const departmentSchema = new mongoose.Schema({
  dep_name: {
    type: String,
    required: true,
  },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// departmentSchema.pre(
//   ["findOneAndDelete", "findByIdAndDelete"],
//   async function (next) {
//     try {
//       const deptId = this.getQuery()._id;

//       const employees = await Employee.find({ department: deptId });
//       for (const emp of employees) {
//         await Employee.findByIdAndDelete(emp._id); // yeh Employee ka middleware call karega
//       }
//       const empIds = employees.map((emp) => emp._id);

//        await Employee.deleteMany({ department: deptId });
//       await Leave.deleteMany({ employeeId: { $in: empIds } });

//       next();
//     } catch (error) {
//       next(error);
//     }
//   }
// );

departmentSchema.pre(
  ["findOneAndDelete", "findByIdAndDelete"],
  async function (next) {
    try {
      const deptId = this.getQuery()._id;

      const employees = await Employee.find({ department: deptId });

      for (const emp of employees) {
        await Employee.findByIdAndDelete(emp._id);
      }

      next();
    } catch (error) {
      next(error);
    }
  }
);

const Department = mongoose.model("Department", departmentSchema);
export default Department;
