import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  addDepartment,
  getDepartments,
  updateDepartment,
  getDepartment,
  deleteDepartment,
} from "../controllers/departmentController.js";
import { logHistory } from "../middleware/historySaveMiddleware.js";

const router = express.Router();

router.post(
  "/add",
  authMiddleware,
  logHistory({
    module: "Department",
    action: "add",
    targetModule: "Department",
  }),
  addDepartment
);
router.get("/", authMiddleware, getDepartments);
router.get("/:id", authMiddleware, getDepartment);
router.put(
  "/:id",
  authMiddleware,
  logHistory({
    module: "Department",
    action: "update",
    targetModule: "Department",
  }),
  updateDepartment
);
router.delete(
  "/:id",
  authMiddleware,
  logHistory({
    module: "Department",
    action: "delete",
    targetModule: "Department",
  }),
  deleteDepartment
);

export default router;
