import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import logger from "../utils/logger.js"
import { MESSAGES } from "../constants/constants.js";

const verifyUser = async (req, res, next) => {
  const apiName = "VERIFY_USER_MIDDLEWARE";
  try {
    logger.info("Verifying user token", { api: apiName });

    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
        logger.warn("Token missing after split", { api: apiName });
      return res
        .status(404)
        .json({ success: false, message:MESSAGES.AUTH.TOKEN_REQUIRED });
    }

    const decode = await jwt.verify(token, process.env.JWT_KEY);
    if (!decode) {
        logger.warn("Invalid token", { api: apiName });
      return res.status(404).json({ success: false, message: MESSAGES.AUTH.TOKEN_INVALID });
    }

    const user = await User.findById({ _id: decode._id }).select("-password");

    if (!user) {
       logger.warn("User not found for decoded token", {
        api: apiName,
        userId: decode._id,
      });
      return res.status(404).json({ success: false,messsage:MESSAGES.AUTH.USER_NOT_FOUND});
    }
    // ✅ Merge DB user + JWT fields
    req.user = {
      ...user.toObject(),
      employeeId: decode.employeeId, // yaha attach karna zaruri hai
      role: decode.role, // role bhi JWT se lo
    };

     logger.info("User verified successfully", {
      api: apiName,
      userId: decode._id,
      role: decode.role,
    });

    next();
  } catch (error) {
    logger.error("Error verifying user", {
      api: apiName,
      message: error.message,
      stack: error.stack,
    });

    return res.status(500).json({
      success: false,
      message:MESSAGES.AUTH.UNAUTHORIZED,
    });
  }
};

export default verifyUser;
