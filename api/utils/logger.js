
import winston from "winston";
import "winston-daily-rotate-file";
import path from "path";

// Folder where logs will be stored
const logDir = path.join("C:\\Users\\91787\\OneDrive\\Desktop\\EMS\\poc-employee-management\\api\\logs");

// Daily rotate transport
const dailyRotateTransport = new winston.transports.DailyRotateFile({
  filename: path.join(logDir, "app-%DATE%.log"), // log file name pattern
  datePattern: "YYYY-MM-DD",                     // new file each day
  zippedArchive: true,                           // compress old logs
  maxSize: "20m",                                // max size per file
  maxFiles: "14d",                               // keep 14 days logs
  level: "info",                                 // default log level
});

// Custom log format: [timestamp] [level] [api_name] message
const customFormat = winston.format.printf(({ timestamp, level, message, api }) => {
  const time = timestamp; // e.g., 2025-08-27 06:44:01 -0400
  const apiName = api || "GENERAL";
  return `[${time}] [${apiName}] [${level.toUpperCase()}] ${message}`;
});

// Winston logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    customFormat
  ),
  transports: [
    dailyRotateTransport,                        // daily rotated file
    // new winston.transports.Console(),            // also log to console
  ],
});

// Optional: stream for morgan (HTTP request logger) integration
// logger.stream = {
//   write: (message) => {
//     logger.info(message.trim());
//   },
// };

export default logger;
