import { MESSAGES } from "../constants/constants.js";
import Attendance from "../models/attendance.model.js";
import Employee from "../models/employee.model.js";
import Leave from "../models/leave.model.js";
import dayjs from "dayjs";
import logger from "../utils/logger.js";

const addLeave = async (req, res) => {
  const apiName = "ADD_LEAVE_API";
  try {
    const { userId, leaveType, startDate, endDate, reason } = req.body;
    logger.info("Add Leave request received", { api: apiName, body: req.body });

    // Basic validation
    if (!userId || !leaveType || !startDate || !endDate) {
      logger.warn("Required fields missing", { api: apiName });
      return res
        .status(400)
        .json({ success: false, message: MESSAGES.LEAVE.REQUIRED_FIELDS });
    }

    // Check if employee exists
    const employee = await Employee.findOne({ userId });
    if (!employee) {
      logger.warn("Employee not found for leave", { api: apiName, userId });
      return res.status(404).json({
        success: false,
        message: MESSAGES.LEAVE.EMPLOYEE_NOT_FOUND,
      });
    }

    // Date check
    if (new Date(startDate) > new Date(endDate)) {
      logger.warn("Invalid leave dates", { api: apiName, startDate, endDate });
      return res
        .status(400)
        .json({ success: false, message: MESSAGES.LEAVE.DATE_INVALID });
    }

    const newLeave = new Leave({
      employeeId: employee._id,
      leaveType,
      startDate,
      endDate,
      reason,
    });
    await newLeave.save();

    logger.info("Leave added successfully", {
      api: apiName,
      leaveId: newLeave._id,
      employeeId: employee._id,
    });

    return res.status(200).json({
      success: true,
      message: MESSAGES.LEAVE.ADDED,
      newRecordId: newLeave._id,
      newValue: newLeave,
      leave: newLeave,
    });
  } catch (error) {
    logger.error("Error adding leave", {
      api: apiName,
      message: error.message,
      stack: error.stack,
    });
    console.error("Add Leave Error:", error.message, error.stack);
    return res.status(500).json({
      success: false,
      message: MESSAGES.LEAVE.SERVER_ERROR,
    });
  }
};

const getLeaves = async (req, res) => {
  const apiName = "GET_LEAVES_API";
  try {
    const { id } = req.params;
    logger.info("Get Leaves request received", { api: apiName, userId: id });

    let leaves = await Leave.find({ employeeId: id }).sort({ appliedAt: -1 });
    if (!leaves || leaves.length === 0) {
      const employee = await Employee.findOne({ userId: id });
      if (employee) {
        leaves = await Leave.find({ employeeId: employee._id }).sort({
          appliedAt: -1,
        });
      }
    }

    if (!leaves || leaves.length === 0) {
      logger.warn("No leaves found", { api: apiName, userId: id });
      return res
        .status(404)
        .json({ success: false, message: MESSAGES.LEAVE.NOT_FOUND });
    }

    logger.info(`Fetched ${leaves.length} leaves successfully`, {
      api: apiName,
      userId: id,
    });

    res
      .status(200)
      .json({ success: true, message: MESSAGES.LEAVE.FETCHED, leaves });
  } catch (error) {
    logger.error("Error fetching leaves", {
      api: apiName,
      message: error.message,
      stack: error.stack,
    });
    return res.status(500).json({
      success: false,
      message: MESSAGES.LEAVE.SERVER_ERROR,
    });
  }
};

const getAllLeaves = async (req, res) => {
  const apiName = "GET_ALL_LEAVES_API";
  try {
    logger.info("Get All Leaves request received", { api: apiName });

    const leaves = await Leave.find()
      .populate({
        path: "employeeId",
        populate: [
          {
            path: "department",
            select: "dep_name",
          },
          {
            path: "userId",
            select: "name",
          },
        ],
      })
      .sort({ appliedAt: -1 });

    if (!leaves || leaves.length === 0) {
      logger.warn("No leaves found", { api: apiName });
      return res.status(404).json({
        success: false,
        message: MESSAGES.LEAVE.NOT_FOUND,
      });
    }

    logger.info(`Fetched ${leaves.length} leaves successfully`, {
      api: apiName,
    });
    // console.log(leaves);
    res
      .status(200)
      .json({ success: true, message: MESSAGES.LEAVE.FETCHED_ALL, leaves });
  } catch (error) {
    logger.error("Error fetching all leaves", {
      api: apiName,
      message: error.message,
      stack: error.stack,
    });
    return res.status(500).json({
      success: false,
      message: MESSAGES.LEAVE.SERVER_ERROR,
    });
  }
};

const getLeaveDetail = async (req, res) => {
  const apiName = "GET_LEAVE_DETAIL_API";
  try {
    const { id } = req.params;
    logger.info("Get Leave Detail request received", {
      api: apiName,
      leaveId: id,
    });

    const leave = await Leave.findById({ _id: id }).populate({
      path: "employeeId", // employee reference in Leave model
      populate: [
        { path: "userId", select: "name profileImage" }, // User details
        { path: "department", select: "dep_name" }, // Department details
      ],
    });

    if (!leave) {
      logger.warn("Leave not found", { api: apiName, leaveId: id });
      return res.status(404).json({
        success: false,
        message: MESSAGES.LEAVE.NOT_FOUND,
      });
    }

    logger.info("Leave detail fetched successfully", {
      api: apiName,
      leaveId: id,
      employeeId: leave.employeeId._id,
    });

    res.json({
      success: true,
      message: MESSAGES.LEAVE.DETAIL,
      leave,
    });
  } catch (error) {
    logger.error("Error fetching leave detail", {
      api: apiName,
      message: error.message,
      stack: error.stack,
    });
    console.error("Error fetching leave:", error);
    res.status(500).json({
      success: false,
      message: MESSAGES.LEAVE.SERVER_ERROR,
    });
  }
};

const updateStatus = async (req, res) => {
  const apiName = "UPDATE_LEAVE_STATUS_API";
  try {
    const { status } = req.body;
    const { id } = req.params;
    logger.info("Update Leave Status request received", {
      api: apiName,
      leaveId: id,
      status,
    });

    const leave = await Leave.findByIdAndUpdate(
      { _id: id },
      { status: status },
      { new: true }
    ).populate("employeeId");

    if (!leave) {
      logger.warn("Leave not found", { api: apiName, leaveId: id });
      res
        .status(404)
        .json({ status: false, message: MESSAGES.LEAVE.NOT_FOUND });
    }

    // ✅ Agar leave Approved hai to Attendance update karo
    if (status && status.toLowerCase() === "approved") {
      let currentDate = dayjs(leave.startDate);
      const endDate = dayjs(leave.endDate);

      while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
        logger.info("Updating attendance for leave", {
          api: apiName,
          userId: leave.employeeId.userId,
          date: currentDate.format("YYYY-MM-DD"),
        });

        await Attendance.updateOne(
          {
            userId: leave.employeeId.userId._id, // Employee se userId nikala
            date: currentDate.format("YYYY-MM-DD"),
          },
          { $set: { status: "Leave" } },
          { upsert: true } // Agar attendance entry nahi hai to create kar dega
        );

        currentDate = currentDate.add(1, "day");
      }
    }
    logger.info("Leave status updated successfully", {
      api: apiName,
      leaveId: id,
      status,
    });

    res.json({
      success: true,
      message: MESSAGES.LEAVE.STATUS_UPDATED,
      newRecordId: leave._id,
      oldValue:"Pending",
      newValue: leave,
      leave,
    });
  } catch (error) {
    logger.error("Error updating leave status", {
      api: apiName,
      message: error.message,
      stack: error.stack,
    });
    console.error("Error updating status:", error);
    res.status(500).json({
      success: false,
      message: MESSAGES.LEAVE.SERVER_ERROR,
    });
  }
};

export { addLeave, getLeaves, getAllLeaves, getLeaveDetail, updateStatus };
