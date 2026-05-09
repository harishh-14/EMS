const locationSchema = new mongoose.Schema(
  {
    lat: { type: Number }, // latitude
    lng: { type: Number }, // longitude
    address: { type: String }, // optional: human-readable address
    accuracy: { type: Number }, // optional: meters (from browser API)
  },
  { _id: false }
);

import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: String, // e.g. "2025-08-18"
      required: true,
    },
    checkInTime: {
      type: String,
    },
    // ✅ ADD: location capture
    checkInLocation: locationSchema,
    checkOutTime: {
      type: String,
    },
    checkOutLocation: locationSchema,
    totalHours: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Present", "Absent", "Leave"],
      default: "Present",
    },
  },
  { timestamps: true }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;
