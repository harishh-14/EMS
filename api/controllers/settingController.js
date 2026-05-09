import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import logger from "../utils/logger.js";
import {MESSAGES} from "../constants/constants.js"

const changePassword = async (req, res) => {
  const apiName = "CHANGE_PASSWORD_API";
  try {
    const { userId, oldPassword, newPassword } = req.body;
    logger.info("Change Password request received", { api: apiName, userId });

    const user = await User.findById({ _id: userId });
    if (!user) {
      logger.warn("User not found", { api: apiName, userId });
      return res
        .status(404)
        .json({ success: false, message: MESSAGES.USER.NOT_FOUND });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      logger.warn("Old password incorrect", { api: apiName, userId });
      return res
        .status(400)
        .json({
          success: false,
          message: MESSAGES.USER.OLD_PASSWORD_INCORRECT,
        });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate({ _id: userId }, { password: hashedPassword });

    logger.info("Password changed successfully", { api: apiName, userId });

    res.json({
      success: true,
      message: MESSAGES.USER.PASSWORD_CHANGED,
      newRecordId: userId,
      oldValue: null, // security reason se store nahi karna
      newValue: null,
    });
  } catch (error) {
    logger.error("Error changing password", {
      api: apiName,
      message: error.message,
      stack: error.stack,
    });
    res
      .status(500)
      .json({ success: false, message: MESSAGES.USER.SERVER_ERROR });
  }
};

export { changePassword };
