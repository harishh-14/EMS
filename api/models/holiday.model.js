
import mongoose from "mongoose";

const holidaySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
      unique: true, // ek hi date pe do baar holiday na ho
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // jisne holiday add kiya (admin)
    },
  },
  { timestamps: true }
);

const Holiday = mongoose.model("Holiday", holidaySchema);
export default Holiday; 
