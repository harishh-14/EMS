import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { changePassword } from "../controllers/settingController.js";
import { logHistory } from "../middleware/historySaveMiddleware.js";

const router = express.Router();

router.put(
  "/change-password",
  authMiddleware,
  logHistory({
    module: "User",
    action: "update",
    targetModule: "User",
    getDescription: ({ req, data }) =>
      `${req.user.name} updated their password`, // updated description
  }),
  changePassword
);

export default router;
