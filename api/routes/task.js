import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { addTask, getAllTask, getTask } from "../controllers/taskController.js";
import { logHistory } from "../middleware/historySaveMiddleware.js";

const router = express.Router();

router.post(
  "/add",
  authMiddleware,
  logHistory({ module: "Task", action: "add", targetModule: "Task" }),
  addTask
);
router.get("/my-tasks", authMiddleware, getTask);
router.get("/", authMiddleware, getAllTask);

export default router;
