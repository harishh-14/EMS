import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  addLeave,
  getLeaves,
  getAllLeaves,
  getLeaveDetail,
  updateStatus,
} from "../controllers/leaveController.js";
import { logHistory } from "../middleware/historySaveMiddleware.js";

const router = express.Router();

router.post(
  "/add",
  authMiddleware,
  logHistory({
    module: "Leave",
    action: "add",
    targetModule: "Leave",
  }),
  addLeave
);

router.get("/:id", authMiddleware, getLeaves);
router.get("/detail/:id", authMiddleware, getLeaveDetail);
router.get("/", authMiddleware, getAllLeaves);

router.put(
  "/:id",
  authMiddleware,
  logHistory({
    module: "Leave",
    action: "update",
    targetModule: "Leave",
  }),
  updateStatus
);

export default router;
