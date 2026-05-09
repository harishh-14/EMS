

import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { checkIn, checkOut, getAllAttendance , getAllAttendanceOfEmployees, getAttendanceSummary, getTodayAttendance} from "../controllers/attendanceController.js";

const router = express.Router();

router.post("/checkin", authMiddleware, checkIn);
router.post("/checkout", authMiddleware, checkOut);
router.get("/all", authMiddleware, getAllAttendance);
router.get("/today", authMiddleware, getTodayAttendance);
router.get("/summary", authMiddleware, getAttendanceSummary);
router.get("/attendanceofallemployees" , authMiddleware , getAllAttendanceOfEmployees)

export default router;
