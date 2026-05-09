import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  addEmployee,
  upload,
  getEmployees,
  getEmployee,
  updateEmployee,
} from "../controllers/employeeController.js";
import { logHistory } from "../middleware/historySaveMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getEmployees);
router.post(
  "/add",
  authMiddleware,
  upload.single("image"),
  logHistory({
    module: "Employee",
    action: "add",
    targetModule: "Employee",
  }),
  addEmployee
);
router.get("/:id", authMiddleware, getEmployee);
router.put(
  "/:id",
  authMiddleware,
  logHistory({
    module: "Employee",
    action: "update",
    targetModule: "Employee",
  }),
  updateEmployee
);

export default router;
