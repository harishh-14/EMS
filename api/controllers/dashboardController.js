import Employee from "../models/employee.model.js";
import Department from "../models/department.model.js";
import Leave from "../models/leave.model.js";
import dayjs from "dayjs";
import Attendance from "../models/attendance.model.js";
import { MESSAGES } from "../constants/constants.js";
import logger from "../utils/logger.js";
import {isWeekend} from "../utils/attendanceHelper.js";

const getSummary = async (req, res) => {
  const apiName = "GET_SUMMARY_API";
  try {
    logger.info("Fetching summary request received", { api: apiName });

    const totalEmployees = await Employee.countDocuments();
    const totalDepartments = await Department.countDocuments();

    const leaveApplied = await Leave.countDocuments();
    const leaveApproved = await Leave.countDocuments({ status: "Approved" });
    const leavePending = await Leave.countDocuments({ status: "Pending" });
    const leaveRejected = await Leave.countDocuments({ status: "Rejected" });

    // Attendance today counts
    const today = dayjs().format("YYYY-MM-DD");

    const [presentToday, leaveToday] = await Promise.all([
      Attendance.countDocuments({ date: today, status: "Present" }),
      Attendance.countDocuments({ date: today, status: "Leave" }),
    ]); // ✅ OPTIMIZED: Parallel queries

    // ✅ Calculate Absent (no record = absent)
    const absentToday = totalEmployees - (presentToday + leaveToday);

    // Weekly Trend (last 7 days)
    const startDate = dayjs().subtract(6, "day").format("YYYY-MM-DD");
    const endDate = today;

    // ✅ OPTIMIZED: fetch all last 7 days attendance at once
    const last7DaysAttendance = await Attendance.find({
      date: { $gte: startDate, $lte: endDate },
    }).lean();

    const weeklyTrend = [];

    for (let i = 6; i >= 0; i--) {
      const day = dayjs().subtract(i, "day").format("YYYY-MM-DD");
      const dayLabel = dayjs().subtract(i, "day").format("ddd");
      const weekend = isWeekend(new Date(day));

      const present = last7DaysAttendance.filter(
        (a) => a.date === day && a.status === "Present"
      ).length;

      const leave = weekend
        ? 0
        : last7DaysAttendance.filter(
            (a) => a.date === day && a.status === "Leave"
          ).length;

      // ✅ Missing employees = Absent
      const absent = weekend ? 0 : totalEmployees - (present + leave);

      weeklyTrend.push({ day: dayLabel, present, absent, leave , weekend});
    }

    logger.info("Summary fetched successfully", {
      api: apiName,
      totalEmployees,
      totalDepartments,
    });

    res.json({
      success: true,
      message: MESSAGES.SUMMARY.FETCH_SUCCESS,
      totalEmployees,
      totalDepartments,
      leaveApplied,
      leaveApproved,
      leavePending,
      leaveRejected,
      attendance: {
        present: presentToday,
        absent: absentToday,
        leave: leaveToday,
      },
      weeklyTrend,
    });
  } catch (err) {
    logger.error("Error fetching summary", {
      api: apiName,
      message: err.message,
      stack: err.stack,
    });
    console.error(err);
    res.status(500).json({
      success: false,
      message: MESSAGES.SUMMARY.FETCH_FAILED,
      error: MESSAGES.GENERAL.SERVER_ERROR,
    });
  }
};

export { getSummary };
