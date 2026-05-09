
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { logHistory } from "../middleware/historySaveMiddleware.js";
import { addHoliday, getHoliday } from "../controllers/holidayController.js";

const router = express.Router();

router.post(
  "/add",
  authMiddleware,
  logHistory({ module: "Holiday", action: "add", targetModule: "Holiday" }),
  addHoliday
);
router.get("/", authMiddleware, getHoliday);

export default router;
