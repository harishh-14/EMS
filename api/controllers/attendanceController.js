import Attendance from "../models/attendance.model.js";
import dayjs from "dayjs";
import User from "../models/user.model.js";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import Leave from "../models/leave.model.js";
import Employee from "../models/employee.model.js";
import { MESSAGES } from "../constants/constants.js";
import logger from "../utils/logger.js";
import { isWeekend } from "../utils/attendanceHelper.js";

dayjs.extend(utc);
dayjs.extend(timezone);

// ✅ Check-In
export const checkIn = async (req, res) => {
  const apiName = "CHECK_IN_API";
  try {
    const userId = req.user._id;
    const today = dayjs().tz("Asia/Kolkata").format("YYYY-MM-DD");

    // 👇 frontend se aayega: { lat, lng, address }
    const { location } = req.body;

    logger.info("Check-in request received", {
      api: apiName,
      userId,
      date: today,
      location,
    });

    // 🔹 Weekend check added
    if (isWeekend(today)) {
      return res.status(200).json({
        success: true,
        message: "Today is a weekend, attendance not required",
        status: "Weekend", // frontend me show karne ke liye
      });
    }

    // 🔍 Check if employee is on approved leave today
    const leave = await Leave.findOne({
      employeeId: req.user.employeeId, // make sure req.user has employeeId
      status: "Approved",
      startDate: { $lte: today },
      endDate: { $gte: today },
    });

    if (leave) {
      logger.warn("Employee is on leave , ", {
        api: apiName,
        userId,
        leaveId: leave._id,
      });
      return res.status(400).json({
        success: false,
        message: MESSAGES.ATTENDANCE.ON_LEAVE,
      });
    }

    // Check if already checked in today
    const existing = await Attendance.findOne({ userId, date: today });
    if (existing && existing.checkInTime) {
      logger.warn("Employee already checked in", {
        api: apiName,
        userId,
        attendanceId: existing._id,
      });
      return res.status(400).json({
        success: false,
        message: MESSAGES.ATTENDANCE.ALREADY_CHECKED_IN,
      });
    }

    const checkInTime = new Date();

    const newAttendance = new Attendance({
      userId,
      date: today,
      checkInTime,
      status: "Present",
      checkInLocation: location, // save location
    });

    await newAttendance.save();

    logger.info("Check-in successful", {
      api: apiName,
      userId,
      attendanceId: newAttendance._id,
      checkInTime,
      location,
    });

    return res.status(200).json({
      success: true,
      message: MESSAGES.ATTENDANCE.SUCCESS,
      checkInTime,
      checkInLocation: {
        ...newAttendance.checkInLocation,
        address:
          newAttendance.checkInLocation?.address ||
          `Lat: ${newAttendance.checkInLocation.lat}, Lng: ${newAttendance.checkInLocation.lng}`,
      },
    });
  } catch (error) {
    logger.error("Check-in error", {
      api: apiName,
      message: error.message,
      stack: error.stack,
    });
    console.log("Check-in error: ", error);
    return res.status(500).json({
      success: false,
      message: MESSAGES.ATTENDANCE.SERVER_ERROR,
      error: "Server error in check-in",
      error: error.message,
    });
  }
};

// ✅ Check-Out
export const checkOut = async (req, res) => {
  const apiName = "CHECK_OUT_API";
  try {
    const userId = req.user._id;
    const today = dayjs().tz("Asia/Kolkata").format("YYYY-MM-DD");
    const { location } = req.body; // 👈 frontend se aayega

    logger.info("Check-out request received", {
      api: apiName,
      userId,
      date: today,
      location,
    });

    // 🔹 Weekend check added
    if (isWeekend(today)) {
      return res.status(200).json({
        success: true,
        message: "Today is a weekend, attendance not required",
        status: "Weekend", // frontend me show karne ke liye
      });
    }

    const attendance = await Attendance.findOne({
      userId,
      date: today,
      checkInTime: { $exists: true },
    });

    if (!attendance || !attendance.checkInTime) {
      logger.warn("Check-out attempted before check-in", {
        api: apiName,
        userId,
        date: today,
      });
      return res.status(400).json({
        success: false,
        message: MESSAGES.ATTENDANCE.MUST_CHECKIN_FIRST,
      });
    }
    if (attendance.checkOutTime) {
      logger.warn("Already checked out", {
        api: apiName,
        userId,
        attendanceId: attendance._id,
      });
      return res.status(400).json({
        success: false,
        message: MESSAGES.ATTENDANCE.ALREADY_CHECKED_OUT,
      });
    }

    const checkOutTime = new Date();

    const totalHours = Number(
      (
        (checkOutTime - new Date(attendance.checkInTime)) /
        1000 /
        60 /
        60
      ).toFixed(2)
    );

    attendance.checkOutTime = checkOutTime;
    attendance.totalHours = totalHours;
    attendance.status = "Present";
    attendance.checkOutLocation = location;

    await attendance.save();

    logger.info("Check-out successful", {
      api: apiName,
      userId,
      attendanceId: attendance._id,
      checkOutTime,
      totalHours,
      location,
    });

    return res.status(200).json({
      success: true,
      message: MESSAGES.ATTENDANCE.CHECKOUT_SUCCESS,
      checkOutTime,
      status: attendance.status,
      totalHours: attendance.totalHours,
      checkOutLocation: {
        ...attendance.checkOutLocation,
        address:
          attendance.checkOutLocation?.address ||
          `Lat: ${attendance.checkOutLocation.lat}, Lng: ${attendance.checkOutLocation.lng}`,
      },
      date: today,
    });
  } catch (error) {
    logger.error("Check-out error", {
      api: apiName,
      userId,
      message: error.message,
      stack: error.stack,
    });
    console.log("Check-out error: ", error);
    return res.status(500).json({
      success: false,
      message: MESSAGES.ATTENDANCE.SERVER_ERROR_CHECKOUT,
      error: error.message,
    });
  }
};

export const getAllAttendance = async (req, res) => {
  const apiName = "GET_ALL_ATTENDANCE";
  try {
    // Get all attendance records, sort by date descending
    const userId = req.user._id;
    logger.info("Fetching all attendance records", { api: apiName, userId });

    const records = await Attendance.find({ userId })
      .populate("userId", "name email") // get user name and email
      .sort({ date: 1 });

    if (!records.length) {
      logger.warn("No attendance records found", { api: apiName, userId });
      return res.status(200).json({
        success: true,
        message: MESSAGES.ATTENDANCE.NO_RECORDS,
        data: [],
      });
    }

    // ✅ Start = first record date
    const startDate = dayjs(records[0].date).startOf("day");

    // ✅ End = today
    const endDate = dayjs().startOf("day");

    // ✅ Fast lookup for existing records
    const recordMap = new Map(
      records.map((r) => [dayjs(r.date).format("YYYY-MM-DD"), r])
    );

    let allDates = [];
    for (
      let d = startDate;
      d.isBefore(endDate) || d.isSame(endDate);
      d = d.add(1, "day")
    ) {
      const key = d.format("YYYY-MM-DD");

      if (recordMap.has(key)) {
        allDates.push(recordMap.get(key));
      } else {
        // ✅ Weekend check here
        if (isWeekend(d.toDate())) {
          allDates.push({
            _id: `weekend-${d.toISOString()}`, // fake id
            date: d.toISOString(),
            userId: records[0].userId,
            checkInTime: null,
            checkOutTime: null,
            totalHours: 0,
            status: "Weekend", // 👈 weekend mark instead of absent
          });
        } else {
          // ✅ Absent record
          allDates.push({
            _id: `absent-${d.toISOString()}`,
            date: d.toISOString(),
            userId: records[0].userId,
            checkInTime: null,
            checkOutTime: null,
            totalHours: 0,
            status: "Absent",
          });
        }
      }
    }

    // ✅ Sort descending before sending
    allDates = allDates.sort((a, b) => new Date(b.date) - new Date(a.date));

    logger.info("Attendance records fetched successfully", {
      api: apiName,
      userId,
      count: allDates.length,
    });

    res.status(200).json({
      success: true,
      message: MESSAGES.ATTENDANCE.FETCH_SUCCESS,
      data: allDates,
    });
  } catch (err) {
    logger.error("Error fetching attendance records", {
      api: apiName,
      message: err.message,
      stack: err.stack,
    });
    res.status(500).json({
      success: false,
      message: MESSAGES.ATTENDANCE.SERVER_ERROR_FETCH,
    });
  }
};

export const getTodayAttendance = async (req, res) => {
  const apiName = "GET_TODAY_ATTENDANCE";
  try {
    const userId = req.user._id;
    const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
    logger.info("Fetching today's attendance", {
      api: apiName,
      userId,
      date: today,
    });

    let attendance = await Attendance.findOne({
      userId,
      date: today,
    });

    if (!attendance) {
      // 🔹 Weekend check
      if (isWeekend(today)) {
        logger.info("Today is a weekend, no attendance required", {
          api: apiName,
          userId,
          date: today,
        });

        attendance = {
          _id: `weekend-${today}`,
          date: today,
          userId,
          checkInTime: null,
          checkOutTime: null,
          totalHours: 0,
          status: "Weekend",
        };
      } else {
        logger.warn("No attendance record found for today", {
          api: apiName,
          userId,
          date: today,
        });

        attendance = {
          _id: `absent-${today}`,
          date: today,
          userId,
          checkInTime: null,
          checkOutTime: null,
          totalHours: 0,
          status: "Absent",
        };
      }
    } else {
      logger.info("Today's attendance fetched successfully", {
        api: apiName,
        userId,
        date: today,
      });
    }

    res.status(200).json({
      success: true,
      message: MESSAGES.ATTENDANCE.TODAY_SUCCESS,
      attendance,
    });
  } catch (error) {
    logger.error("Error fetching today's attendance", {
      api: apiName,
      message: error.message,
      stack: error.stack,
    });
    console.error(error);
    res.status(500).json({
      success: false,
      message: MESSAGES.ATTENDANCE.SERVER_ERROR_TODAY,
      error: error.message,
    });
  }
};

// Get Dashboard Summary for logged-in Employee
export const getAttendanceSummary = async (req, res) => {
  const apiName = "GET_ATTENDANCE_SUMMARY";
  try {
    const userId = req.user._id;
    logger.info("Fetching attendance summary", { api: apiName, userId });

    // ✅ 1. Today’s status
    const today = dayjs().tz("Asia/Kolkata").format("YYYY-MM-DD"); // ensure same timezone
    const todayAttendance = await Attendance.findOne({ userId, date: today });

    let todaysStatus = {
      checkedInTime: null,
      checkedOutTime: null,
      totalHours: 0,
      statusText: "Not Yet Checked In", // default
    };

    if (todayAttendance) {
      todaysStatus.checkedInTime = todayAttendance.checkInTime || null;
      todaysStatus.checkedOutTime = todayAttendance.checkOutTime || null;
      todaysStatus.totalHours = todayAttendance.totalHours || 0;

      if (todayAttendance.checkInTime && !todayAttendance.checkOutTime) {
        todaysStatus.statusText = "Checked In";
      } else if (todayAttendance.checkOutTime) {
        todaysStatus.statusText = "Checked Out";
      } else {
        todaysStatus.statusText = "Not Yet Checked In";
      }
    }

    // ✅ 2. Last login from User model
    const user = await User.findById(userId);
    const lastLogin = user?.lastLogin
      ? dayjs(user.lastLogin)
          .tz("Asia/Kolkata")
          .format("DD MMM YYYY, hh:mm:ss A")
      : null;

    // ✅ 3. Attendance Overview
    const records = await Attendance.find({ userId });
    const employee = await Employee.findOne({ userId });

    // ✅ 4. Determine start & end dates
    const startDate = records[0]
      ? dayjs(records[0].date).startOf("day")
      : dayjs().startOf("day");
    const endDate = dayjs().startOf("day");

    // ✅ 5. Map existing records
    const recordMap = new Map(
      records.map((r) => [dayjs(r.date).format("YYYY-MM-DD"), r])
    );

    // ✅ 6. Generate full attendance with fake absent for missing days
    let allDates = [];
    for (
      let d = startDate;
      d.isBefore(endDate) || d.isSame(endDate);
      d = d.add(1, "day")
    ) {
      const key = d.format("YYYY-MM-DD");
      if (recordMap.has(key)) {
        allDates.push(recordMap.get(key));
      } else if (isWeekend(d.toDate())) {
        allDates.push({
          date: d.toISOString(),
          status: "Weekend",
        });
      } else {
        allDates.push({
          date: d.toISOString(),
          status: "Absent",
        });
      }
    }

    let approvedLeaves = [];
    if (employee) {
      approvedLeaves = await Leave.find({
        employeeId: employee._id,
        status: "Approved",
      });
    }

    // ✅ 8. Count present, absent, leave
    const presentCount = allDates.filter(
      (a) => a.status?.toLowerCase() === "present"
    ).length;

    const weekendCount = allDates.filter(
      (a) => a.status?.toLowerCase() === "weekend"
    ).length;

    const leaveCount = approvedLeaves.reduce((acc, l) => {
      const start = dayjs(l.startDate);
      const end = dayjs(l.endDate);

      // Only count days within attendance range (startDate → endDate)
      const leaveStart = start.isBefore(startDate) ? startDate : start;
      const leaveEnd = end.isAfter(endDate) ? endDate : end;

      return acc + leaveEnd.diff(leaveStart, "day") + 1; // inclusive
    }, 0);

    // ✅ 9. Calculate absent count
    const workingDays = allDates.length - weekendCount;
    let absentCount = workingDays - presentCount - leaveCount;
    if (absentCount < 0) absentCount = 0;

    // ✅ 10. Attendance % excluding weekends
const attendancePercent = workingDays > 0
  ? ((presentCount / workingDays) * 100).toFixed(2)
  : 0;

    const quickSummary = {
      attendancePercent,
      absentDays: absentCount,
      leaves: leaveCount,
      weekends: weekendCount,
    };

    logger.info("Attendance summary fetched successfully", {
      api: apiName,
      userId,
      todaysStatus,
      quickSummary,
    });

    return res.status(200).json({
      success: true,
      message: MESSAGES.ATTENDANCE.SUMMARY_SUCCESS,
      todaysStatus,
      lastLogin,
      quickSummary,
      overview: {
        present: presentCount,
        absent: absentCount,
        leave: leaveCount,
        weekend: weekendCount,
      },
    });
  } catch (error) {
    logger.error("Error fetching attendance summary", {
      api: apiName,
      message: error.message,
      stack: error.stack,
    });
    console.error("Error in getAttendanceSummary:", error);
    res.status(500).json({
      success: false,
      message: MESSAGES.ATTENDANCE.SERVER_ERROR_SUMMARY,
    });
  }
};

// Show attendance of all the employees
export const getAllAttendanceOfEmployees = async (req, res) => {
  const apiName = "GET_ALL_ATTENDANCE_OF_EMPLOYEES";
  try {
    const { from, to, employeeId } = req.query; // frontend se ?date=2025-08-21 aayega
    logger.info("Fetching attendance of employees", {
      api: apiName,
      from,
      to,
      employeeId,
    });

    let filter = {};
    if (from && to) {
      // Filter attendance between from and to dates (inclusive)
      filter.date = {
        $gte: dayjs(from).format("YYYY-MM-DD"),
        $lte: dayjs(to).format("YYYY-MM-DD"),
      };
    } else if (from) {
      // If only from is provided, treat it as a single day
      filter.date = dayjs(from).format("YYYY-MM-DD");
    }

    // 🔥 CHANGE: fetch employee details if filter applied
    let allEmployees;
    let leaveFilter = {};
    if (employeeId) {
      filter.userId = employeeId;

      // get employee by userId
      const empDoc = await Employee.findOne({ userId: employeeId }).populate(
        "userId",
        "name email"
      );

      if (!empDoc) {
        logger.warn("Employee not found", { api: apiName, employeeId });
        return res.status(404).json({
          success: false,
          message: MESSAGES.ATTENDANCE.EMPLOYEE_NOT_FOUND,
        });
      }

      allEmployees = [empDoc.userId]; // only that employee
      leaveFilter.employeeId = empDoc._id; // 🔥 CHANGE (Employee._id not User._id)
    } else {
      allEmployees = await User.find({ role: "employee" }, "_id name email");
    }

    // ✅ Attendance
    const attendanceRecords = await Attendance.find(filter).populate({
      path: "userId",
      select: "name email",
    });

    // ✅ Leaves
    if (from && to) {
      leaveFilter.startDate = { $lte: new Date(to) };
      leaveFilter.endDate = { $gte: new Date(from) };
    }
    const leaveRecords = await Leave.find({
      ...leaveFilter,
      status: "Approved",
    }).populate({
      path: "employeeId",
      populate: { path: "userId", select: "name email" },
    });

    // ✅ Convert maps
    let finalRecords = [];

    const attendanceMap = {};
    for (let rec of attendanceRecords) {
      const key =
        rec.userId._id.toString() +
        "-" +
        dayjs(rec.date).startOf("day").format("YYYY-MM-DD");
      attendanceMap[key] = rec;
    }

    const leaveMap = {};
    for (let leave of leaveRecords) {
      const empId = leave.employeeId.userId._id.toString(); // 🔥 CHANGE: use userId
      let start = dayjs(leave.startDate);
      let end = dayjs(leave.endDate);

      for (
        let d = start;
        d.isBefore(end) || d.isSame(end, "day");
        d = d.add(1, "day")
      ) {
        const key = empId + "-" + d.startOf("day").format("YYYY-MM-DD");
        leaveMap[key] = {
          ...leave._doc,
          date: d.format("YYYY-MM-DD"),
          user: leave.employeeId.userId,
        };
      }
    }

    // ✅ Final loop
    const startDate = from ? dayjs(from) : dayjs();
    const endDate = to ? dayjs(to) : startDate;

    for (
      let d = startDate;
      d.isBefore(endDate) || d.isSame(endDate, "day");
      d = d.add(1, "day")
    ) {
      for (let emp of allEmployees) {
        const empId = emp._id ? emp._id.toString() : emp.toString();
        const key = empId + "-" + d.startOf("day").format("YYYY-MM-DD");

        // ✅ PRIORITIZE LEAVE FIRST
        if (leaveMap[key]) {
          finalRecords.push({
            userId: leaveMap[key].user,
            date: d.format("YYYY-MM-DD"),
            status: "Leave",
            leaveType: leaveMap[key].leaveType,
          });
        } else if (attendanceMap[key]) {
          finalRecords.push({
            ...attendanceMap[key]._doc,
            status: attendanceMap[key].status || "Present",
          });
        } else {
          // 🔹 Weekend check here
          if (isWeekend(d.toDate())) {
            finalRecords.push({
              userId: emp,
              date: d.format("YYYY-MM-DD"),
              status: "Weekend",
            });
          } else {
            finalRecords.push({
              userId: emp,
              date: d.format("YYYY-MM-DD"),
              status: "Absent",
            });
          }
        }
      }
    }

    logger.info("Attendance records fetched", {
      api: apiName,
      count: finalRecords.length,
    });

    res.status(200).json({
      success: true,
      message: MESSAGES.ATTENDANCE.ALL_EMPLOYEES_FETCH_SUCCESS,
      count: finalRecords.length,
      data: finalRecords,
    });
  } catch (error) {
    logger.error("Error fetching attendance of employees", {
      api: apiName,
      message: error.message,
      stack: error.stack,
    });
    console.error("Error fetching attendance:", error);
    res.status(500).json({
      success: false,
      message: MESSAGES.ATTENDANCE.ALL_EMPLOYEES_FETCH_ERROR,
    });
  }
};
