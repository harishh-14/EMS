import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import sendEmail from "../utils/email.js";
import PasswordReset from "../models/resetPassword.model.js";
import Employee from "../models/employee.model.js";
import { MESSAGES } from "../constants/constants.js";
import logger from "../utils/logger.js";

const login = async (req, res) => {
  const apiName = "LOGIN_API";
  try {
    const { email, password } = req.body;

    // Log the login attempt
    logger.info(`Login attempt with email : ${email}`, { api: apiName });

    if (!email || !password) {
      logger.warn(`Missing email or password`, {
        api: apiName,
        body: req.body,
      });
      return res.status(400).json({
        success: false,
        message: MESSAGES.AUTH.EMAIL_PASSWORD_REQUIRED,
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      logger.warn(`User not found`, { api: apiName, email });
      return res
        .status(404)
        .json({ success: false, message: MESSAGES.AUTH.USER_NOT_FOUND });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      logger.warn(`Invalid credentials`, { api: apiName, email });
      return res
        .status(404)
        .json({ success: false, message: MESSAGES.AUTH.INVALID_CREDENTIALS });
    }

    // 3️⃣ ✅ Last login update
    user.lastLogin = new Date();
    await user.save();
    logger.info(`User logged in successfully`, {
      api: apiName,
      userId: user._id,
    });

    let employee = null;
    if (user.role === "employee") {
      employee = await Employee.findOne({ userId: user._id });
      if (employee) {
        logger.info(`Employee record found`, {
          api: apiName,
          employeeId: employee._id,
        });
      }
    }

    const token = jwt.sign(
      {
        _id: user._id,
        role: user.role,
        employeeId: employee ? employee._id.toString() : null,
      },
      process.env.JWT_KEY,
      { expiresIn: "10d" }
    );

    logger.info(`Token generated successfully`, {
      api: apiName,
      userId: user._id,
    });

    return res.status(200).json({
      success: true,
      message: MESSAGES.AUTH.LOGIN_SUCCESS,
      token,
      user: { _id: user._id, name: user.name, role: user.role },
    });
  } catch (error) {
    logger.error(`Login error: ${error.message}`, {
      api: apiName,
      stack: error.stack,
    });
    res.status(500).json({
      success: false,
      message: MESSAGES.GENERAL.SERVER_ERROR,
      error: error.message,
    });
  }
};

const verify = async (req, res) => {
  const apiName = "VERIFY_API";
  try {
    logger.info("Verify API called", { api: apiName, userId: req.user?._id });
    res.status(200).json({
      success: true,
      message: MESSAGES.AUTH.VERIFY_SUCCESS,
      user: req.user,
    });
    logger.info("User verification successful", {
      api: apiName,
      userId: req.user?._id,
    });
  } catch (error) {
    logger.error("User verification failed", {
      api: apiName,
      message: error.message,
      stack: error.stack,
    });

    res.status(500).json({
      success: false,
      message: MESSAGES.AUTH.VERIFY_FAILED,
      error: error.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  const apiName = "FORGOT_PASSWORD_API";
  try {
    const { email } = req.body;
    logger.info("Forgot Password request received", { api: apiName, email });
    if (!email) {
      logger.warn("Email is missing in request", {
        api: apiName,
        body: req.body,
      });
      return res
        .status(400)
        .json({ success: false, message: MESSAGES.AUTH.EMAIL_REQUIRED });
    }

    const user = await User.findOne({ email });
    if (!user) {
      logger.warn("User not found for forgot password", {
        api: apiName,
        email,
      });
      return res
        .status(404)
        .json({ success: false, message: MESSAGES.AUTH.USER_NOT_FOUND });
    }

    // Generate reset token (valid for 15 minutes)
    const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY, {
      expiresIn: "15m",
    });

    // Save in DB also
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes
    await PasswordReset.create({ token, userId: user._id, expiresAt });
    logger.info("Password reset token created", {
      api: apiName,
      userId: user._id,
      token,
    });

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

    await sendEmail(
      user.email,
      "Password Reset Request",
      `
      <h2>Hello ${user.name},</h2>
      <p>You requested to reset your password.</p>
      <p>Click below link to reset:</p>
      <a href=${resetLink} 
         style="padding:10px 20px; background:#007bff; color:#fff; text-decoration:none; border-radius:5px;">
         Reset Password
      </a>
      <p><b>Note:</b> Link is valid for 15 minutes only.</p>
    `
    );
    logger.info("Password reset email sent", {
      api: apiName,
      userId: user._id,
      email: user.email,
    });

    return res.json({
      success: true,
      message: MESSAGES.AUTH.RESET_LINK_SENT,
    });
  } catch (error) {
    logger.error("Forgot Password error", {
      api: apiName,
      message: error.message,
      stack: error.stack,
    });
    console.error("Forgot Password Error:", error);
    return res.status(500).json({
      success: false,
      message: MESSAGES.AUTH.RESET_FAILED,
      error: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  const apiName = "RESET_PASSWORD_API";
  try {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;

    logger.info("Reset Password request received", { api: apiName, token });

    if (!newPassword || !confirmPassword) {
      logger.warn("Password or confirmPassword missing", {
        api: apiName,
        body: req.body,
      });
      return res.status(400).json({
        success: false,
        message: MESSAGES.AUTH.PASSWORD_REQUIRED,
      });
    }

    if (!newPassword || newPassword.length < 6) {
      logger.warn("Password too short", {
        api: apiName,
        userInputLength: newPassword.length,
      });
      return res.status(400).json({
        success: false,
        message: MESSAGES.AUTH.PASSWORD_MIN_LENGTH,
      });
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      logger.warn("Passwords do not match", { api: apiName });
      return res.status(400).json({
        success: false,
        message: MESSAGES.AUTH.PASSWORDS_NOT_MATCH,
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_KEY);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        logger.warn("Token expired", { api: apiName, token });
        return res.status(401).json({
          success: false,
          message: MESSAGES.AUTH.TOKEN_EXPIRED,
        });
      }
      logger.warn("Invalid token", { api: apiName, token });
      return res
        .status(401)
        .json({ success: false, message: MESSAGES.AUTH.TOKEN_INVALID });
    }

    // Check token in DB
    const resetRecord = await PasswordReset.findOne({ token });
    if (!resetRecord || resetRecord.expiresAt < Date.now()) {
      logger.warn("Reset link expired or invalid", { api: apiName, token });
      return res
        .status(400)
        .json({ success: false, message: MESSAGES.AUTH.RESET_LINK_EXPIRED });
    }

    // Check if user exists in DB
    const user = await User.findById(decoded._id);
    if (!user) {
      logger.warn("User not found for password reset", {
        api: apiName,
        userId: decoded._id,
      });
      return res
        .status(404)
        .json({ success: false, message: MESSAGES.AUTH.USER_NOT_FOUND });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    await PasswordReset.deleteOne({ token });
    logger.info("Password reset successfully", {
      api: apiName,
      userId: user._id,
    });

    return res.json({
      success: true,
      message: MESSAGES.AUTH.PASSWORD_RESET_SUCCESS,
    });
  } catch (error) {
    logger.error("Reset Password error", {
      api: apiName,
      message: error.message,
      stack: error.stack,
    });
    console.error("Reset Password Error:", error);
    return res
      .status(500)
      .json({ success: false, message: MESSAGES.AUTH.PASSWORD_RESET_FAILED });
  }
};

export const checkResetToken = async (req, res) => {
  const apiName = "CHECK_RESET_TOKEN_API";
  try {
    const { token } = req.params;
    logger.info("Check reset token request received", { api: apiName, token });

    // Step 1: Verify JWT
    jwt.verify(token, process.env.JWT_KEY);
    logger.info("JWT token verification successful", { api: apiName, token });

    // Step 2: Check DB (optional)
    const resetRecord = await PasswordReset.findOne({ token });
    if (!resetRecord || resetRecord.expiresAt < Date.now()) {
      logger.warn("Reset token expired or not found in DB", {
        api: apiName,
        token,
      });
      return res.json({ success: false, message: MESSAGES.AUTH.TOKEN_EXPIRED });
    }
    logger.info("Reset token is valid", { api: apiName, token });

    return res.json({ success: true, message: MESSAGES.AUTH.TOKEN_VALID });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      logger.warn("TokenExpiredError: token has expired", {
        api: apiName,
        token,
      });
      return res.json({ success: false, message: MESSAGES.AUTH.TOKEN_EXPIRED });
    }

    logger.error("Invalid token error", {
      api: apiName,
      token,
      message: err.message,
      stack: err.stack,
    });
    return res.json({ success: false, message: MESSAGES.AUTH.TOKEN_INVALID });
  }
};

export { login, verify, forgotPassword, resetPassword };
